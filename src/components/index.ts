import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { YooCheckout, type ICreatePayment } from '@a2seven/yoo-checkout';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

/** -----------------------------------------------------------
 * 1. Конфиг из env (firebase functions:config:set yookassa.shop_id="..." ...)
 * ---------------------------------------------------------- */
const yookassaConfig = functions.config().yookassa || {};
const shopId: string = yookassaConfig.shop_id;
const secretKey: string = yookassaConfig.secret_key;

const checkout = new YooCheckout({ shopId, secretKey });

/** -----------------------------------------------------------
 * 2. Callable‑функция «создать платёж»
 *    – указываем обобщённые типы, чтобы `data.tariff` существовал
 *    – `context` имеет тип CallableContext, а не Response
 * ---------------------------------------------------------- */
type Tariff = 'basic' | 'pro';

interface CreatePaymentRequest {
  tariff: Tariff;
}

interface CreatePaymentResponse {
  paymentId: string;
  confirmationUrl: string;
}

export const createPayment = functions
  .region('europe‑central2')
  .https.onCall<CreatePaymentRequest, CreatePaymentResponse>(async (data, context) => {
    /*  ❌  context может быть undefined? — нет, у onCall строго CallableContext.
        Но TypeScript ругался, потому что параметр был объявлен без типа. */
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Login required');
    }

    const { tariff } = data; // теперь свойство tariff существует
    const uid = context.auth.uid;

    let amount: { value: string; currency: 'RUB' };
    let periodDays: number;

    switch (tariff) {
    case 'basic':
      amount = { value: '199.00', currency: 'RUB' };
      periodDays = 30;
      break;
    case 'pro':
      amount = { value: '499.00', currency: 'RUB' };
      periodDays = 365;
      break;
    default:
      throw new functions.https.HttpsError('invalid-argument', 'Unknown tariff');
    }

    const idempotenceKey = uuidv4();
    const payload: ICreatePayment = {
      amount,
      confirmation: {
        type: 'redirect',
        return_url: 'https://your‑site.com/payment-return',
      },
      description: `Algomentor subscription – ${tariff}`,
      metadata: { uid, tariff, periodDays },
    };

    const payment = await checkout.createPayment(payload, idempotenceKey);

    /*  ✅  onCall нужно вернуть JS‑объект, а не Response,
        поэтому возвращаем обычный литерал.  */
    return {
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url!,
    };
  });

export const yooWebhook = functions
  .region('europe‑central2')
  .https.onRequest(async (req, res): Promise<void> => {
    /* --- проверка подписи (по желанию) --- */
    const bodyStr = JSON.stringify(req.body);
    const signature = req.get('Content‑Yoomoney‑Signature') ?? '';
    const hash = crypto.createHmac('sha256', secretKey).update(bodyStr).digest('base64');

    if (signature && signature !== hash) {
      res.status(401).send('Invalid signature');
      return;
    }

    try {
      if (req.body.event === 'payment.succeeded') {
        const payment = req.body.object;
        const { uid, tariff, periodDays } = payment.metadata ?? {};

        if (!uid || !tariff || !periodDays) {
          res.status(400).send('Missing metadata');
          return;
        }

        const periodEnd = admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + Number(periodDays) * 24 * 60 * 60 * 1000),
        );

        await db.doc(`subscriptions/${uid}`).set(
          {
            status: 'active',
            plan: tariff,
            current_period_end: periodEnd,
            paymentId: payment.id,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }

      res.status(200).send('OK');
    } catch (err) {
      console.error(err);
      res.status(500).send('error');
    }
  });