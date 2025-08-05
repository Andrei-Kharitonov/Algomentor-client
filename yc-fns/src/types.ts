import type { PLANS } from './common';

export interface Plan {
  amount: { value: string; currency: 'RUB' };
  days: number;
}

export interface PaymentMetadata {
  uid: string;
  tariff: keyof typeof PLANS;
  periodDays: number;
}