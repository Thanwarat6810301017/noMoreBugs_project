const API_BASE = '/api';

export const fetchDbStatus = async () => {
  try {
    const res = await fetch(`${API_BASE}/db-status`);
    return await res.json();
  } catch {
    return { connected: false, message: 'Running on Fallback Mode (Memory)' };
  }
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

export const fetchTables = async () => {
  const res = await fetch(`${API_BASE}/tables`);
  return await res.json();
};

export const fetchReservations = async () => {
  const res = await fetch(`${API_BASE}/reservations`);
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
