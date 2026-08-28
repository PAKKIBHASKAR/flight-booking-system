const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('skyway_auth_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('skyway_auth_token', token);
  } else {
    localStorage.removeItem('skyway_auth_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred while communicating with the server.');
  }

  return data;
}

export const api = {
  // Auth API
  signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),

  // Flights API
  searchFlights: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/flights?${query}`);
  },
  getFlightDetails: (id) => request(`/flights/${id}`),

  // Bookings API
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getMyBookings: () => request('/bookings/my-bookings'),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PUT' })
};
