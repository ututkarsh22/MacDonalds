import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Order Confirmed!</h1>
      <p className="mb-6 text-gray-700">Thank you for ordering from McDonald's. Your food is on the way!</p>
      <Link to="/" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
        Back to Home
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;
