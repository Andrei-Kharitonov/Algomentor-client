"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const common_1 = require("./common");
const handler = async (event) => {
    const body = JSON.parse(event.body ?? '{}');
    if (body.event !== 'payment.succeeded')
        return { statusCode: 200, body: 'ignored' };
    const pay = body.object;
    const meta = pay.metadata;
    if (!meta?.uid)
        return { statusCode: 400, body: 'missing uid' };
    const periodEnd = Date.now() + meta.periodDays * 86400000; // ms
    await common_1.firestore.doc(`subscriptions/${meta.uid}`).set({
        status: 'active',
        plan: meta.tariff,
        period_end: periodEnd,
        paymentId: pay.id,
        updated_at: Date.now()
    }, { merge: true });
    return { statusCode: 200, body: 'OK' };
};
exports.handler = handler;
