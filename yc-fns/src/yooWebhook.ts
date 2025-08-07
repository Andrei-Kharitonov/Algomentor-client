import type { APIGatewayProxyHandler } from 'aws-lambda';
import { firestore } from './common';
import type { PaymentMetadata } from './types';

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body ?? '{}');
  if (body.event !== 'payment.succeeded')
    return { statusCode: 200, body: 'ignored' };

  const pay = body.object;
  const meta = pay.metadata as PaymentMetadata | undefined;
  if (!meta?.uid) return { statusCode: 400, body: 'missing uid' };

  const periodEnd = Date.now() + meta.periodDays * 86_400_000; 

  await firestore.doc(`subscriptions/${meta.uid}`).set(
    {
      status: 'active',
      plan: meta.tariff,
      period_end: periodEnd,
      paymentId: pay.id,
      updated_at: Date.now()
    },
    { merge: true }
  );

  return { statusCode: 200, body: 'OK' };
};