import React from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

const YooKassaButton: React.FC = () => {
  const handleClick = async () => {
    try {
      const functions = getFunctions(app);
      const createPayment = httpsCallable(functions, 'createPayment');

      const result: any = await createPayment({ amount: 2.00 });

      const confirmationUrl = result.data.confirmation_url;
      if (confirmationUrl) {
        window.location.href = confirmationUrl;
      } else {
        alert('Не удалось получить ссылку на оплату');
      }
    } catch (error) {
      console.error('Ошибка создания платежа:', error);
      alert('Ошибка при создании платежа');
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '12px 24px',
        backgroundColor: '#00a3e0',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer'
      }}
    >
      Оплатить через YooKassa
    </button>
  );
};

export default YooKassaButton;
