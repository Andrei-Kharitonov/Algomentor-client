// pay.ts
import { getIdToken } from 'firebase/auth';
import { auth } from './components/firebase';

export async function buy(tariff: 'basic' | 'pro') {
  if (!auth.currentUser) {
    alert('Пожалуйста, войдите в аккаунт');
    return;
  }

  const token = await getIdToken(auth.currentUser, true);
  // pay.ts — сразу перед fetch:
  console.log('token-head', (await getIdToken(auth.currentUser!, true)).slice(0, 20) + '…');
  const res = await fetch(
    'https://functions.yandexcloud.net/d4ehpjlbciubvtug23kh',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ tariff })
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Оплата не создана', res.status, err);
    alert(`Ошибка ${res.status}: ${err.error ?? 'не удалось создать платёж'}`);
    return;
  }

  const { confirmationUrl } = await res.json();
  window.location.href = confirmationUrl;     // теперь undefined не случится
}