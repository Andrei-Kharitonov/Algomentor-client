import type { APIGatewayProxyHandler } from 'aws-lambda';
import { timingSafeEqual } from 'crypto';
import { firestore, checkout } from './common';

type YkEvent = 'payment.succeeded' | string;

interface YkPaymentObject {
  id: string;
  metadata?: unknown | null;
}
interface YkWebhookPayload {
  event: YkEvent;
  object?: YkPaymentObject | null;
}

type SubscriptionStatus = 'active' | 'canceled' | 'trial' | 'expired';
interface SubscriptionDoc {
  uid: string;
  status: SubscriptionStatus;
  plan: string;
  period_end: number;
  paymentId: string;
  updated_at: number;
}

// ---------- type guards & helpers ----------

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const isString = (v: unknown): v is string => typeof v === 'string';

const parseIntLoose = (v: unknown): number | null => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const isYkPaymentObject = (v: unknown): v is YkPaymentObject =>
  isRecord(v) && isString(v.id);

const isYkWebhookPayload = (v: unknown): v is YkWebhookPayload =>
  isRecord(v) && isString(v.event);

function verifyBasic(header: string | undefined | null): boolean {
  if (!header) return false;
  const { SHOP_ID, SECRET_KEY } = process.env;
  if (!SHOP_ID || !SECRET_KEY) return false;
  const expected = 'Basic ' + Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString('base64');
  const a = Buffer.from(header.trim());
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function verifyQuerySecret(qsSecret: string | undefined | null): boolean {
  const expected = process.env.WEBHOOK_SECRET;
  if (!expected) return false;
  return (qsSecret ?? '') === expected;
}

// ---------- metadata parsing (more tolerant) ----------

type NormalizedMeta = {
  uid: string;
  tariff: string;       // plan id / tariff code
  periodDays: number;   // subscription period in days
};

// accepts multiple key variants commonly used by providers / backends
function normalizePaymentMeta(m: unknown): NormalizedMeta | null {
  if (!isRecord(m)) return null;

  // uid variants
  const uidRaw =
    (m.uid as unknown) ??
    (m.userId as unknown) ??
    (m.user_id as unknown) ??
    (m.customer_uid as unknown);

  const tariffRaw =
    (m.tariff as unknown) ??
    (m.plan as unknown) ??
    (m.plan_id as unknown);

  const daysRaw =
    (m.periodDays as unknown) ??
    (m.period_days as unknown) ??
    (m.days as unknown);

  const uid = isString(uidRaw) ? uidRaw : null;
  const tariff = isString(tariffRaw) ? tariffRaw : null;
  const periodDays = parseIntLoose(daysRaw);

  if (!uid || !tariff || periodDays == null) {
    console.error('metadata missing fields', {
      hasUid: Boolean(uid),
      hasTariff: Boolean(tariff),
      hasDays: periodDays != null,
      raw: m,
    });
    return null;
  }
  return { uid, tariff, periodDays };
}

// ---------- handler ----------

export const handler: APIGatewayProxyHandler = async (event) => {
  // 1) auth
  const h = event.headers ?? {};
  const authHeader =
    h.authorization ??
    h.Authorization ??
    h['x-original-authorization'] ??
    h['X-Original-Authorization'] ??
    null;
  const qsSecret = event.queryStringParameters?.hook_secret ?? null;

  if (!verifyBasic(authHeader) && !verifyQuerySecret(qsSecret)) {
    console.warn('unauthorized webhook', { hasAuthHeader: Boolean(authHeader), hasQsSecret: Boolean(qsSecret) });
    return { statusCode: 401, body: 'bad auth' };
  }

  // 2) parse JSON
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body ?? '', 'base64').toString('utf-8')
    : (event.body ?? '{}');

  let unknownPayload: unknown;
  try {
    unknownPayload = JSON.parse(raw);
  } catch (e) {
    console.error('bad json', { raw, err: String(e) });
    return { statusCode: 400, body: 'bad json' };
  }
  if (!isYkWebhookPayload(unknownPayload)) {
    console.error('bad payload shape', { payload: unknownPayload });
    return { statusCode: 400, body: 'bad payload' };
  }
  const payload: YkWebhookPayload = unknownPayload;

  // 3) only payments we care about
  if (payload.event !== 'payment.succeeded') {
    return { statusCode: 200, body: 'ignored' };
  }
  if (!payload.object || !isYkPaymentObject(payload.object)) {
    console.error('missing object', { payload });
    return { statusCode: 400, body: 'missing object' };
  }

  const paymentId = payload.object.id;

  // 4) get metadata (from webhook first, then fallback to API)
  let meta = normalizePaymentMeta(payload.object.metadata);
  if (!meta) {
    try {
      const fetched: unknown = await checkout.getPayment(paymentId);
      const fetchedMeta =
        isRecord(fetched) && 'metadata' in fetched
          ? (fetched as { metadata?: unknown }).metadata
          : undefined;
      meta = normalizePaymentMeta(fetchedMeta);
    } catch (e) {
      console.error('getPayment failed', { paymentId, err: String(e) });
    }
  }
  if (!meta) {
    console.error('missing meta after all attempts', {
      paymentId,
      webhookMeta: payload.object.metadata,
    });
    return { statusCode: 400, body: 'missing meta' };
  }

  // 5) compute period & write to Firestore (creates collection/doc if absent)
  const now = Date.now();
  const periodEnd = now + meta.periodDays * 86_400_000; // 86400 * 1000

  const subRef = firestore.doc(`subscriptions/${meta.uid}`);

  try {
    await firestore.runTransaction(async (tx) => {
      const snap = await tx.get(subRef);
      const prev = (snap.exists ? (snap.data() as Partial<SubscriptionDoc>) : undefined);

      // idem-potent: if this payment already processed — no-op
      if (prev?.paymentId === paymentId) {
        console.info('duplicate payment, skipping', { uid: meta.uid, paymentId });
        return 'noop';
      }

      const update: Partial<SubscriptionDoc> = {
        uid: meta.uid,
        status: 'active',
        plan: meta.tariff,
        period_end: periodEnd,
        paymentId,
        updated_at: now,
      };
      tx.set(subRef, update, { merge: true }); 
      return 'updated';
    });
  } catch (e) {
    console.error('firestore transaction failed', { uid: meta.uid, paymentId, err: String(e) });
    return { statusCode: 500, body: 'retry later' };
  }

  return { statusCode: 200, body: 'OK' };
};