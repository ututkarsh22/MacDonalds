const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const fetchMenu = async () => {
  const res = await fetch(`${BASE_URL}/api/menu`);
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch(`${BASE_URL}/api/orders`);
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

export const signupUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const placeOrder = async (order) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  return res.json();
};
