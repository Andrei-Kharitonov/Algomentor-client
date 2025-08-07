import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { checkout, authAdmin, PLANS } from './common';

export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  const origin = process.env.FRONT_ORIGIN ?? '*';

  /* ----------  CORS  ----------- */
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    // 👇 разрешаем наш новый заголовок
    'Access-Control-Allow-Headers': 'Content-Type, X-Firebase-Token',
    'Access-Control-Max-Age':       '86400',
    'Content-Type':                 'application/json',
    Vary: 'Origin'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    /* 1. токен ---------------------------------------------------------- */
    const token = event.headers['X-Firebase-Token']
               || event.headers['x-firebase-token'];  // учтём оба регистра

    console.log('HEADERS', event.headers);
    console.log('TOKEN-HEAD', token?.slice(0, 30) + '…');

    if (!token) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'No token' }) };
    }

    let uid: string;
    try {
      ({ uid } = await authAdmin.verifyIdToken(token));
      console.log('verify OK', uid);
    } catch (e) {
      console.error('verify FAIL', e);
      throw e;                               // перейдём в catch ниже
    }

    /* 2. тариф ---------------------------------------------------------- */
    const { tariff = 'basic' } = JSON.parse(event.body || '{}') as {
      tariff?: keyof typeof PLANS;
    };
    if (!PLANS[tariff]) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Bad tariff' }) };
    }
    const plan = PLANS[tariff];

    /* 3. для отладки печатаем env -------------------------------------- */
    console.log('ENV', {
      SHOP_ID:    process.env.SHOP_ID,
      SECRET_KEY: process.env.SECRET_KEY?.slice(0, 15) + '…'
    });

    /* 4. создаём платёж -------------------------------------------------- */
    const payment = await checkout.createPayment(
      {
        amount:       plan.amount,
        confirmation: { type: 'redirect', return_url: 'https://your-site.ru/thanks' },
        description:  `Algomentor ${tariff}`,
        metadata:     { uid, tariff, periodDays: plan.days }
      },
      uuidv4()
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ confirmationUrl: payment.confirmation.confirmation_url })
    };
  } catch (err) {
    console.error('PAYMENT_ERROR', {
      statusCode: err?.statusCode,
      message:    err?.message,
      response:   err?.response?.data ?? err?.body ?? err
    });

    const code = err?.statusCode ?? 500;
    return {
      statusCode: code,
      headers,
      body: JSON.stringify({
        error:   err?.message ?? 'Unknown error',
        details: err?.response?.data ?? err?.body ?? null
      })
    };
  }
};