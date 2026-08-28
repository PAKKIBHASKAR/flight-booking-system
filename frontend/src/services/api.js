let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
// Strip trailing slashes
rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');

// If user entered backend host without /api suffix, append /api
if (rawBaseUrl.startsWith('http') && !rawBaseUrl.endsWith('/api')) {
  rawBaseUrl += '/api';
}

const API_BASE_URL = rawBaseUrl;

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

  // Ensure endpoint starts with a single slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const response = await fetch(`${API_BASE_URL}${formattedEndpoint}`, {
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
