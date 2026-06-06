import { AUTH_URL, SUBMISSIONS_URL, fetchJsonWithAuth } from './dropdownApi';

const FIELD_CONFIG_PATH = '/admin/field-config';
const CUSTOMIZABLE_MODULES = [
  { key: 'job', apiModule: 'jobs' },
  { key: 'candidate', apiModule: 'candidates' },
  { key: 'submissions', apiModule: 'submissions' },
];

function firstArray(...values) {
  return values.find(Array.isArray) ?? [];
}

function firstValue(record, keys, fallback) {
  return keys.map((key) => record?.[key]).find((value) => value !== undefined && value !== null && value !== '') ?? fallback;
}

function normalizeTotal(payload, users) {
  return (
    payload?.total ??
    payload?.totalCount ??
    payload?.count ??
    payload?.recordsTotal ??
    payload?.meta?.total ??
    payload?.pagination?.total ??
    users.length
  );
}

export async function getAllUsers({ offset = 0, limit = 10, sortBy = 'new' } = {}) {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
    sortBy,
  });

  const json = await fetchJsonWithAuth(AUTH_URL, `/get-all-users?${params}`);
  const payload = json.data ?? json;
  const users = firstArray(
    payload,
    json.users,
    json.rows,
    json.items,
    json.records,
    payload?.users,
    payload?.data,
    payload?.rows,
    payload?.items,
    payload?.records,
    payload?.docs,
    payload?.result,
    payload?.results
  );

  return {
    users,
    total: normalizeTotal({ ...json, ...payload }, users),
  };
}

export function getUserId(user) {
  const value = firstValue(
    user?.raw ?? user,
    ['USER_ID', 'user_id', 'userId', 'id', '_id', 'uuid'],
    user?.key
  );
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : value;
}

function normalizeModuleField(field, index) {
  const fieldName = firstValue(field, ['label', 'Label', 'fieldName', 'field_name', 'name', 'fieldLabel', 'value'], `Field ${index + 1}`);
  const fieldKey = firstValue(field, ['field', 'Field', 'fieldKey', 'field_key', 'key', 'value', 'fieldName', 'name'], fieldName);
  const showValue = firstValue(field, ['isVisible', 'is_visible', 'visible', 'show', 'is_show', 'isShow', 'enabled'], true);

  return {
    ...field,
    fieldKey,
    fieldName,
    type: firstValue(field, ['type', 'Type'], 'text'),
    isVisible: typeof showValue === 'string' ? !['false', '0', 'hide', 'hidden', 'no'].includes(showValue.toLowerCase()) : Boolean(showValue),
  };
}

async function getFieldConfigModule(apiModule, userId) {
  const params = new URLSearchParams({
    module: apiModule,
    userId: String(userId ?? ''),
  });
  const json = await fetchJsonWithAuth(AUTH_URL, `${FIELD_CONFIG_PATH}?${params}`);
  const payload = json.data ?? json;
  return firstArray(payload, payload?.visibleFields, json?.visibleFields);
}

async function getDropdownModuleFields(apiModule) {
  const json = await fetchJsonWithAuth(SUBMISSIONS_URL, `/filter-dropdown-fields?module=${encodeURIComponent(apiModule)}`);
  const payload = json.data ?? json;
  return firstArray(payload, payload?.fields, payload?.items, payload?.rows, json?.fields);
}

export async function getUserModuleFields(user) {
  const userId = getUserId(user);
  const entries = await Promise.all(
    CUSTOMIZABLE_MODULES.map(async ({ key, apiModule }) => {
      let fields;
      let source = 'field-config';

      try {
        fields = await getFieldConfigModule(apiModule, userId);
      } catch (err) {
        if (err.status !== 404) throw err;
        source = 'dropdown-fields';
        fields = await getDropdownModuleFields(apiModule);
      }

      return [
        key,
        fields.map((field, index) => ({
          ...normalizeModuleField(field, index),
          module: key,
          apiModule,
          source,
          userId,
        })),
      ];
    })
  );

  return Object.fromEntries(entries);
}

function visibleFieldPayload(fields) {
  return fields.map((field) => ({
    label: field.fieldName,
    field: field.fieldKey,
    isVisible: field.isVisible,
    type: field.type ?? 'text',
  }));
}

export async function updateUserModuleFieldConfig(user, module, fields) {
  const userId = getUserId(user);
  const apiModule = CUSTOMIZABLE_MODULES.find((item) => item.key === module)?.apiModule ?? module;

  return fetchJsonWithAuth(AUTH_URL, FIELD_CONFIG_PATH, {
    method: 'PUT',
    body: JSON.stringify({
      module: apiModule,
      userId,
      visibleFields: visibleFieldPayload(fields),
    }),
  });
}

export async function updateUserModuleFields(user, moduleFields) {
  return Promise.all(
    Object.entries(moduleFields).map(([module, fields]) => (
      updateUserModuleFieldConfig(user, module, fields)
    ))
  );
}
