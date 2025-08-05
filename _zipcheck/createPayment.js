"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const common_1 = require("./common");
const handler = async (event) => {
    const origin = process.env.FRONT_ORIGIN ?? '*';
    // Единый набор заголовков для ВСЕХ ответов (одинаковый тип!)
    const headers = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
        'Vary': 'Origin'
    };
    // Префлайт
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }
    try {
        // 1) Проверяем токен
        const bearer = event.headers.Authorization || event.headers.authorization;
        if (!bearer?.startsWith('Bearer ')) {
            return { statusCode: 401, headers, body: JSON.stringify({ error: 'No token' }) };
        }
        const token = bearer.slice('Bearer '.length);
        const { uid } = await common_1.authAdmin.verifyIdToken(token);
        // 2) Тариф
        const { tariff = 'basic' } = JSON.parse(event.body || '{}');
        if (!common_1.PLANS[tariff]) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Bad tariff' }) };
        }
        const plan = common_1.PLANS[tariff];
        // 3) Платёж
        const payment = await common_1.checkout.createPayment({
            amount: plan.amount,
            confirmation: { type: 'redirect', return_url: 'https://your-site.ru/thanks' },
            description: `Algomentor ${tariff}`,
            metadata: { uid, tariff, periodDays: plan.days }
        }, (0, uuid_1.v4)());
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ confirmationUrl: payment.confirmation.confirmation_url })
        };
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
};
exports.handler = handler;
