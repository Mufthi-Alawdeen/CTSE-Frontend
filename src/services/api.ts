import axios from 'axios';

const envBaseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const pageIsHttps =
  typeof window !== 'undefined' && window.location.protocol === 'https:';

// Our API calls are written like `api.get('/api/events')`.
// So `baseURL` should be either:
// - empty/undefined (use same-origin `/api/...`), or
// - an absolute origin without a trailing `/api` segment.
// If the page is served over HTTPS, do not use an `http://` baseURL (mixed content).
let resolvedBaseURL: string | undefined;
if (envBaseURL) {
  resolvedBaseURL = envBaseURL.trim().replace(/\/api\/?$/, '').replace(/\/$/, '');
  if (pageIsHttps && resolvedBaseURL.startsWith('http://')) {
    resolvedBaseURL = undefined;
  }
}

const api = axios.create({
  baseURL: resolvedBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
