import { getIdToken } from 'firebase/auth';
import { auth } from './components/firebase';

const FN_URL = 'https://functions.yandexcloud.net/d4ehpjlbciubvtug23kh';

export async function buy(tariff: 'basic' | 'pro' | 'basic365' | 'pro365') {
  const token = await getIdToken(auth.currentUser!, true);  

  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Firebase-Token': token 
    },
    body: JSON.stringify({ tariff })
  });

  if (!res.ok) {
    console.error('Оплата не создана', res.status, await res.json());
    return;
  }

  const { confirmationUrl } = await res.json();
  window.location.href = confirmationUrl;
}