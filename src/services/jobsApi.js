const BASE_URL = 'http://192.168/v1';
// const AUTH_URL = 'http://192.168.0.130:9009/authapi/v1';
export const AUTH_URL = 'http://192.168.1.66/authapi/v1';

const LOGIN_CREDENTIALS = {
  email: 'zinnext@realtekconsulting.net',
  user_pwd: 'Admin@123*',
};

// In-flight login promise — prevents multiple simultaneous login calls
let loginPromise = null;

async function login() {
  if (loginPromise) return loginPromise;

  loginPromise = fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(LOGIN_CREDENTIALS),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      const json = await res.json();
      // Handle common token field names returned by auth APIs
      const token = json.token ?? json.access_token ?? json.data?.token ?? json.data?.access_token;
      if (!token) throw new Error('No token in login response');
      localStorage.setItem('authToken', token);
      return token;
    })
    .finally(() => {
      loginPromise = null;
    });

  return loginPromise;
}

async function ensureToken() {
  const token = localStorage.getItem('authToken');
  if (token) return token;
  return login();
}

async function authHeaders() {
  const token = await ensureToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

async function apiGet(path) {
  const headers = await authHeaders();
  let res = await fetch(`${BASE_URL}${path}`, { headers });

  // Token expired — re-login once and retry
  if (res.status === 401) {
    localStorage.removeItem('authToken');
    const freshHeaders = await authHeaders();
    res = await fetch(`${BASE_URL}${path}`, { headers: freshHeaders });
  }

  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const json = await res.json();
  return json.data ?? json;
}

export async function getAllJobs() {
  return apiGet('/jobs');
}

export async function getJobById(id) {
  return apiGet(`/jobs/${id}`);
}

export async function getJobDetailedView(module, id) {
  const token = await ensureToken();
  const response = await fetch(`${AUTH_URL}/detailedView?module=${module}&id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // preferably from localStorage/session
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}