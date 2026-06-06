const BASE_URL = 'http://192.168.1.66/submissionsapi/v1';
// const AUTH_URL = 'http://192.168.1.66/authapi/v1';
const JOBS_URL = 'http://192.168.1.66/jobsapi/v1';
// export const AUTH_URL = 'http://192.168.0.127:9009/authapi/v1';
export const AUTH_URL = 'http://192.168.1.66/authapi/v1';
export const SUBMISSIONS_URL = BASE_URL;

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';
const AUTH_LOGIN_SESSION_KEY = 'authLoginSession';
const LOGIN_STORAGE_KEYS = [
  'access_token',
  'refresh_token',
  'id_token',
  'token_type',
  'expires_in',
  'refresh_expires_in',
  'menu',
  'footermenu',
  'menuPermission',
  'default_values',
  'roleId',
  'companyName',
  'preferred_Username',
  'user_Email',
  'userName',
  'userId',
  'tenantId',
  'businessId',
  'businessUnitId',
  'activeKey',
];

const TEST_FLOW_MODULE = 'test-flows';
const TEST_FLOW_FIELDS = [
  { value: 'module', label: 'Module', isVisible: true },
  { value: 'flow', label: 'Flow', isVisible: true },
  { value: 'step_order', label: 'Step Order', isVisible: true },
  { value: 'keyword', label: 'Action', isVisible: true },
  { value: 'description', label: 'Description', isVisible: true },
  { value: 'target', label: 'Key', isVisible: true },
  { value: 'tags', label: 'Tags', isVisible: true },
  { value: 'value', label: 'Value', isVisible: true },
  { value: 'expected', label: 'Expected', isVisible: true },
];

const LMS_FLOW_MODULE = 'lms-flows';
const LMS_FLOW_FIELDS = [
  { value: 'module', label: 'Module', isVisible: true },
  { value: 'flow', label: 'Flow', isVisible: true },
  { value: 'step_order', label: 'Step Order', isVisible: true },
  { value: 'keyword', label: 'Action', isVisible: true },
  { value: 'description', label: 'Description', isVisible: true },
  { value: 'target', label: 'Key', isVisible: true },
  { value: 'tags', label: 'Tags', isVisible: true },
  { value: 'value', label: 'Value', isVisible: true },
  { value: 'expected', label: 'Expected', isVisible: true },
];

// In-flight login promise — prevents multiple simultaneous login calls
let loginPromise = null;

function extractToken(json) {
  return (
    json?.token ??
    json?.access_token ??
    json?.accessToken ??
    json?.jwt ??
    json?.data?.token ??
    json?.data?.access_token ??
    json?.data?.accessToken ??
    json?.data?.jwt
  );
}

function extractUser(json) {
  return json?.user ?? json?.data?.user ?? json?.data?.profile ?? null;
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Unable to decode login token:', error);
    return null;
  }
}

function setLocalStorageJson(key, value) {
  if (value === undefined || value === null) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function getLoginMenus(json, data) {
  return data?.menus ?? json?.menus ?? {
    menu: data?.menu ?? json?.menu,
    footermenu: data?.footermenu ?? json?.footermenu,
  };
}

function persistLoginResponse(json, token, user) {
  const data = json?.data ?? json;
  const tokenPayload = decodeJwtPayload(token) ?? {};
  const menus = getLoginMenus(json, data);
  const userName = (
    user?.userName ??
    user?.name ??
    data?.userName ??
    data?.name ??
    tokenPayload.userName ??
    tokenPayload.name ??
    tokenPayload.preferred_username ??
    tokenPayload.email
  );
  const preferredUsername = (
    user?.preferred_Username ??
    user?.preferred_username ??
    data?.preferred_Username ??
    data?.preferred_username ??
    tokenPayload.preferred_Username ??
    tokenPayload.preferred_username ??
    tokenPayload.email ??
    userName
  );
  const userEmail = user?.email ?? data?.email ?? tokenPayload.email ?? preferredUsername;

  localStorage.setItem('access_token', token);
  if (data?.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
  if (data?.id_token !== undefined) localStorage.setItem('id_token', data.id_token);
  if (data?.token_type) localStorage.setItem('token_type', data.token_type);
  if (data?.expires_in !== undefined) localStorage.setItem('expires_in', String(data.expires_in));
  if (data?.refresh_expires_in !== undefined) localStorage.setItem('refresh_expires_in', String(data.refresh_expires_in));
  if (userName) localStorage.setItem('userName', userName);
  if (preferredUsername) localStorage.setItem('preferred_Username', preferredUsername);
  if (userEmail) localStorage.setItem('user_Email', userEmail);
  if (data?.roleId ?? tokenPayload.role_id) localStorage.setItem('roleId', data?.roleId ?? tokenPayload.role_id);
  if (data?.companyName) localStorage.setItem('companyName', data.companyName);
  if (tokenPayload.userId !== undefined) localStorage.setItem('userId', String(tokenPayload.userId));
  if (tokenPayload.tenantId) localStorage.setItem('tenantId', tokenPayload.tenantId);
  if (tokenPayload.businessId) localStorage.setItem('businessId', tokenPayload.businessId);
  if (tokenPayload.businessUnitId) localStorage.setItem('businessUnitId', tokenPayload.businessUnitId);

  setLocalStorageJson('menu', menus.menu);
  setLocalStorageJson('footermenu', menus.footermenu);
  setLocalStorageJson('menuPermission', data?.menuPermission);
  setLocalStorageJson('default_values', data?.default_values);
}

export function getStoredToken() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const hasActiveLoginSession = sessionStorage.getItem(AUTH_LOGIN_SESSION_KEY) === '1';

  return token && hasActiveLoginSession ? token : null;
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  LOGIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  sessionStorage.removeItem(AUTH_LOGIN_SESSION_KEY);
  window.dispatchEvent(new Event('auth:logout'));
}

export async function login(credentials) {
  if (loginPromise) return loginPromise;

  loginPromise = fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
    .then(async (res) => {
      const json = await res.json();
      if (!res.ok) {
        const error = new Error(json?.message ?? json?.error ?? `Login failed: ${res.status}`);
        error.status = res.status;
        throw error;
      }

      const token = extractToken(json);
      if (!token) throw new Error('No token in login response');
      const user = extractUser(json);

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      sessionStorage.setItem(AUTH_LOGIN_SESSION_KEY, '1');
      if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      persistLoginResponse(json, token, user);

      return { token, user, response: json };
    })
    .finally(() => {
      loginPromise = null;
    });

  return loginPromise;
}

async function ensureToken() {
  const token = getStoredToken();
  if (token) return token;

  const error = new Error('Authentication required');
  error.status = 401;
  throw error;
}

async function authHeaders() {
  const token = await ensureToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function fetchJsonWithAuth(baseUrl, path, options = {}) {
  const headers = await authHeaders();
  const requestOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  let res = await fetch(`${baseUrl}${path}`, requestOptions);

  if (res.status === 401) {
    logout();
  }

  if (!res.ok) {
    const error = new Error(`API ${res.status}: ${res.statusText}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function apiGetWithAuth(baseUrl, path) {
  const json = await fetchJsonWithAuth(baseUrl, path);
  return json.data ?? json;
}

async function apiGet(path) {
  return apiGetWithAuth(BASE_URL, path);
}

async function authapiGet(path) {
  return apiGetWithAuth(AUTH_URL, path);
}

async function authapiPost(path, payload) {
  const json = await fetchJsonWithAuth(AUTH_URL, path, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return json.data ?? json;
}

/**
 * Fetch available filter fields for a module.
 * Returns: [{ label, value, type }, ...]
 */
export async function getDropdownFields(module) {
  if (module === TEST_FLOW_MODULE) return TEST_FLOW_FIELDS;
  if (module === LMS_FLOW_MODULE) return LMS_FLOW_FIELDS;

  return apiGet(`/filter-dropdown-fields?module=${encodeURIComponent(module)}`);
}

export async function getFieldConfig(module) {
  if (module === TEST_FLOW_MODULE) return TEST_FLOW_FIELDS;
  if (module === LMS_FLOW_MODULE) return LMS_FLOW_FIELDS;

  return authapiGet(`/admin/field-config?module=${encodeURIComponent(module)}`);
}

export async function getTestingOptions(type) {
  return authapiGet(`/testing-modules?type=${encodeURIComponent(type)}`);
}

export async function addTestingOption({ name, type }) {
  return authapiPost('/testing-modules', { name, type });
}

export async function addTestFlow(payload) {
  return authapiPost('/test-flows', payload);
}

export async function getTestFlows({
  limit = 10,
  offset = 0,
  search = '',
  module = '',
  keyword = '',
  tags = '',
  active,
} = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (search) params.append('search', search);
  if (module) params.append('module', module);
  if (keyword) params.append('keyword', keyword);
  if (tags) params.append('tags', tags);
  if (active !== undefined && active !== null && active !== '') {
    params.append('active', String(active));
  }

  return authapiGet(`/test-flows?${params.toString()}`);
}

export async function addLmsFlow(payload) {
  return authapiPost('/lms-flows', payload);
}

export async function getLmsFlows({
  limit = 10,
  offset = 0,
  search = '',
  module = '',
  keyword = '',
  tags = '',
  active,
} = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (search) params.append('search', search);
  if (module) params.append('module', module);
  if (keyword) params.append('keyword', keyword);
  if (tags) params.append('tags', tags);
  if (active !== undefined && active !== null && active !== '') {
    params.append('active', String(active));
  }

  return authapiGet(`/lms-flows?${params.toString()}`);
}

export async function getModuleDataList(module, limit = 10, offset = 0, options = {}) {
  const {
    scope = '',
    sort = '',
    sortDir = '',
  } = options;

  if (module === TEST_FLOW_MODULE) {
    const data = await getTestFlows({ limit, offset });
    const rows = Array.isArray(data?.items) ? data.items : [];
    const total = Number(data?.total) || 0;

    return {
      items: rows,
      total,
      limit,
      offset,
      tabs: [{ key: 'all', title: 'Test Cases', count: total }],
    };
  }

  if (module === LMS_FLOW_MODULE) {
    const data = await getLmsFlows({ limit, offset });
    const rows = Array.isArray(data?.items) ? data.items : [];
    const total = Number(data?.total) || 0;

    return {
      items: rows,
      total,
      limit,
      offset,
      tabs: [{ key: 'all', title: 'LMS Cases', count: total }],
    };
  }

  const params = new URLSearchParams({
    module,
    limit: String(limit),
    offset: String(offset),
  });
  if (scope) params.set('scope', scope);
  if (sort) params.set('sort', sort);
  if (sortDir) params.set('sortDir', sortDir);

  return fetchJsonWithAuth(AUTH_URL, `/module-data-list?${params.toString()}`);
}

/**
 * Fetch distinct values for a specific field in a module.
 * Returns: [{ label, value }, ...]
 */
export async function getDropdownValues(module, field, search = '', limit = 50, offset = 0) {
  const params = new URLSearchParams({
    module,
    field,
    value: search,
    limit: String(limit),
    offset: String(offset),
  });
  return apiGet(`/filter-dropdown-values?${params}`);
}

export async function getDashboardOnboardingCount(
  payload,
  limit = 10,
  offset = 0
) {
  const headers = await authHeaders();

  const response = await fetch(
    `${SUBMISSIONS_URL}/dashboard-onboarding-count?offset=${offset}&limit=${limit}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }
  );

  const json = await response.json();
  return json.data ?? json;
}

export async function getJobs({
  jobStatus = 'active',
  jobRecruitmentStatus = 'unread',
  limit = 50,
  offset = 0,
  userId = 1,
  sortBy = 'id',
} = {}) {
  const headers = await authHeaders();

  const params = new URLSearchParams({
    jobStatus,
    jobRecruitmentStatus,
    limit: String(limit),
    offset: String(offset),
    userId: String(userId),
    sortBy,
  });

  const response = await fetch(
    `${JOBS_URL}/jobs?${params.toString()}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data ?? json;
}


export async function getFormGroups({
  module,
} = {}) {
  if (!module) throw new Error('module is required to fetch form groups');

  const headers = await authHeaders();

  const params = new URLSearchParams({
    module,
  });

  const response = await fetch(
    `${AUTH_URL}/admin/form-groups?${params.toString()}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data ?? json;
}

export async function getCandidateFormGroups(options = {}) {
  return getFormGroups({ module: 'candidates', ...options });
}
