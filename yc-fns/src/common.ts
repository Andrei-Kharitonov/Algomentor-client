import { YooCheckout } from '@a2seven/yoo-checkout';
import { cert, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { Plan } from './types';


const saBase64 = process.env.FB_SERVICE_ACCOUNT_B64;

const saJsonRaw =
  saBase64
    ? Buffer.from(saBase64, 'base64').toString('utf-8')
    : process.env.FB_SERVICE_ACCOUNT_JSON;

if (!saJsonRaw) {
  throw new Error(
    'Firebase service account is missing. Set FB_SERVICE_ACCOUNT_B64 or FB_SERVICE_ACCOUNT_JSON env var.'
  );
}

const serviceJson: ServiceAccount = JSON.parse(saJsonRaw);
initializeApp({ credential: cert(serviceJson) });

export const authAdmin = getAuth();
export const firestore = getFirestore();

export const checkout = new YooCheckout({
  shopId:    process.env.SHOP_ID    as string,
  secretKey: process.env.SECRET_KEY as string
});

export const PLANS: Record<'basic' | 'pro' | 'basic365' | 'pro365', Plan> = {
  basic: { amount: { value: '2990.00', currency: 'RUB' }, days: 30 },
  basic365: { amount: { value: '19990.00', currency: 'RUB' }, days: 365 },
  pro: { amount: { value: '3990.00', currency: 'RUB' }, days: 30 },
  pro365: { amount: { value: '24990.00', currency: 'RUB' }, days: 365 }
};