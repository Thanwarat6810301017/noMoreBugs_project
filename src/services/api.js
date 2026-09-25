const API_BASE = '/api';

export const fetchDbStatus = async () => {
  try {
    const res = await fetch(`${API_BASE}/db-status`);
    return await res.json();
  } catch {
    return { connected: false, message: 'Running on Fallback Mode (Memory)' };
  }
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/categories`);
  return await res.json();
};

export const fetchMenuItems = async (categoryId = null) => {
  const url = categoryId ? `${API_BASE}/menu?category_id=${categoryId}` : `${API_BASE}/menu`;
  const res = await fetch(url);
  return await res.json();
};

export const createMenuItem = async (menuData) => {
  const res = await fetch(`${API_BASE}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menuData)
  });
  return await res.json();
};

export const updateMenuItem = async (id, menuData) => {
  const res = await fetch(`${API_BASE}/menu/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menuData)
  });
  return await res.json();
};

export const deleteMenuItem = async (id) => {
  const res = await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' });
  return await res.json();
};

export const fetchTables = async () => {
  const res = await fetch(`${API_BASE}/tables`);
  return await res.json();
};

export const updateTableStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/tables/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return await res.json();
};

export const fetchReservations = async () => {
  const res = await fetch(`${API_BASE}/reservations`);
  return await res.json();
};

export const fetchUserReservations = async (userId) => {
  const res = await fetch(`${API_BASE}/user/reservations?user_id=${userId}`);
  return await res.json();
};

export const fetchAdminStats = async () => {
  const res = await fetch(`${API_BASE}/admin/stats`);
  return await res.json();
};

export const createReservation = async (reservationData) => {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData)
  });
  return await res.json();
};

export const updateReservationStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/reservations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return await res.json();
};
