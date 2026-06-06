import { ConfigProvider } from 'antd';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'vitest';
import {
  AUTH_URL,
  getFieldConfig,
  getModuleDataList,
  login,
} from '../services/dropdownApi';

export const REAL_API_FETCH_LIMIT = 200;
export const REAL_API_SAMPLE_SIZE = 50;

const REAL_API_LOGIN_CREDENTIALS = {
  email: import.meta.env.VITE_REAL_API_EMAIL ?? 'zinnext@realtekconsulting.net',
  user_pwd: import.meta.env.VITE_REAL_API_PASSWORD ?? 'Admin@123*',
};

let apiReachabilityError = null;

export function renderModulePage(Page) {
  return render(
    <ConfigProvider>
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

function getNestedValue(record, key) {
  if (!record || !key) return undefined;
  if (Object.prototype.hasOwnProperty.call(record, key)) return record[key];

  return String(key)
    .split('.')
    .reduce((value, pathPart) => value?.[pathPart], record);
}

function hasFieldValue(record, key) {
  const value = getNestedValue(record, key);

  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;

  return true;
}

function getItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.rows)) return response.rows;
  if (Array.isArray(response?.records)) return response.records;
  if (Array.isArray(response?.applicant)) return response.applicant;
  if (Array.isArray(response?.candidates)) return response.candidates;
  if (Array.isArray(response?.submissions)) return response.submissions;
  if (Array.isArray(response?.jobs)) return response.jobs;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.rows)) return response.data.rows;
  if (Array.isArray(response?.data?.records)) return response.data.records;
  if (Array.isArray(response?.data?.applicant)) return response.data.applicant;
  if (Array.isArray(response?.data?.candidates)) return response.data.candidates;
  if (Array.isArray(response?.data?.submissions)) return response.data.submissions;
  if (Array.isArray(response?.data?.jobs)) return response.data.jobs;
  return [];
}

function getResponseTotal(response, rows) {
  const payload = response?.data ?? response;
  const total = response?.total
    ?? response?.count
    ?? response?.totalCount
    ?? response?.recordsTotal
    ?? response?.meta?.total
    ?? response?.pagination?.total
    ?? payload?.total
    ?? payload?.count
    ?? payload?.totalCount
    ?? payload?.recordsTotal
    ?? payload?.meta?.total
    ?? payload?.pagination?.total
    ?? rows.length;

  return Number(total) || rows.length;
}

function getFieldItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.fields)) return response.fields;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.headers)) return response.headers;
  if (Array.isArray(response?.columns)) return response.columns;
  if (Array.isArray(response?.data?.fields)) return response.data.fields;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.headers)) return response.data.headers;
  if (Array.isArray(response?.data?.columns)) return response.data.columns;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function getRecordId(record, index) {
  return String(
    record.id
    ?? record._id
    ?? record.candidateId
    ?? record.submissionId
    ?? record.jobId
    ?? record.key
    ?? `record-${index + 1}`,
  );
}

function pickFirst20Middle10Last20(records) {
  if (records.length <= REAL_API_SAMPLE_SIZE) {
    return {
      sample: records,
      note: `full scan - all ${records.length} records`,
    };
  }

  const first = records.slice(0, 20);
  const middleStart = Math.max(20, Math.floor((records.length - 10) / 2));
  const middle = records.slice(middleStart, middleStart + 10);
  const last = records.slice(-20);
  const seen = new Set();
  const sample = [...first, ...middle, ...last].filter((record, index) => {
    const key = getRecordId(record, index);

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    sample,
    note: `first 20 + middle 10 + last 20 - ${sample.length} of ${records.length} records`,
  };
}

function buildApiCoverageReport(moduleName, records, requiredFields) {
  const sampleResult = pickFirst20Middle10Last20(records);
  const rows = requiredFields.map(({ keys, label }) => {
    const missingRows = sampleResult.sample
      .map((record, index) => ({ record, index }))
      .filter(({ record }) => !keys.some((key) => hasFieldValue(record, key)));
    const missingRecords = missingRows.map(({ record }) => record);
    const missingRowNumbers = missingRows.slice(0, 5).map(({ index }) => index + 1);

    return {
      label,
      passed: sampleResult.sample.length - missingRecords.length,
      missing: missingRecords.length,
      total: sampleResult.sample.length,
      sampleIds: missingRecords.slice(0, 5).map(getRecordId),
      sampleRows: missingRowNumbers,
      hasFirstRowFail: missingRows.some(({ index }) => index === 0),
      firstMissingKeys: missingRecords[0] ? Object.keys(missingRecords[0]).join(', ') : '',
    };
  });
  const failingFields = rows.filter((row) => row.missing > 0);
  const report = [
    '',
    `  ${moduleName} API Field Coverage Report`,
    '  ------------------------------------------------------------',
    `  Scanned: ${sampleResult.note}`,
    `  Result: ${failingFields.length === 0 ? 'OK' : `${failingFields.length} field(s) have gaps`}`,
    ...rows.map((row) => (
      [
        `  ${row.label}`,
        `PASS ${row.passed} / ${row.total}`,
        `FAIL ${row.missing} / ${row.total}`,
        row.missing === 0
          ? 'OK'
          : `Rows: ${row.sampleRows.join(', ')}${row.hasFirstRowFail ? ' | FIRST ROW FAIL' : ''} | IDs: ${row.sampleIds.join(', ')} | Keys: ${row.firstMissingKeys}`,
      ].join(' | ')
    )),
    '',
  ].join('\n');

  return {
    allPassed: failingFields.length === 0,
    scannedCount: sampleResult.sample.length,
    report,
  };
}

function canonicalFieldName(fieldConfig) {
  return String(
    fieldConfig.field
    ?? fieldConfig.value
    ?? fieldConfig.key
    ?? fieldConfig.name
    ?? fieldConfig.label
    ?? '',
  ).trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function buildHeaderFieldsReport(moduleName, fields, requiredFields) {
  const present = new Set(fields.map(canonicalFieldName));
  const matched = requiredFields.filter((field) => (
    present.has(field.toLowerCase().replace(/[\s_-]+/g, ''))
  ));
  const report = matched.length > 0
    ? `${moduleName} header fields OK - matched ${matched.join(', ')}`
    : `${moduleName} header fields missing expected keys. Returned: ${[...present].join(', ')}`;

  return {
    allPassed: matched.length > 0,
    report,
  };
}

function buildUrl(path, params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  return `${path}?${searchParams.toString()}`;
}

export async function loginRealApi() {
  try {
    await login(REAL_API_LOGIN_CREDENTIALS);
    apiReachabilityError = null;
  } catch (error) {
    apiReachabilityError = error;
  }
}

export function assertApiReachable() {
  if (!apiReachabilityError) return;

  throw new Error([
    'Real module list API integration test did not run.',
    'API server is not reachable at http://192.168.1.66.',
    `Original error: ${apiReachabilityError.message}`,
  ].join('\n'));
}

async function fetchModuleDataWithFallback(moduleName, fallbackModuleNames = []) {
  const moduleNames = [moduleName, ...fallbackModuleNames];
  let lastError = null;

  for (const currentModuleName of moduleNames) {
    try {
      const response = await getModuleDataList(currentModuleName, REAL_API_FETCH_LIMIT, 0);
      return {
        moduleName: currentModuleName,
        response,
      };
    } catch (error) {
      lastError = error;
      if (error.status !== 400) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function expectRealModuleDataReport(moduleName, requiredDataFields, options = {}) {
  assertApiReachable();
  const { failOnGaps = false, fallbackModuleNames = [] } = options;

  const { moduleName: apiModuleName, response } = await fetchModuleDataWithFallback(
    moduleName,
    fallbackModuleNames,
  );
  const endpoint = buildUrl(`${AUTH_URL}/module-data-list`, {
    module: apiModuleName,
    limit: REAL_API_FETCH_LIMIT,
    offset: 0,
  });
  const records = getItems(response);
  const apiTotal = getResponseTotal(response, records);

  expect(records.length).toBeGreaterThanOrEqual(REAL_API_SAMPLE_SIZE);

  const { allPassed, scannedCount, report } = buildApiCoverageReport(
    apiModuleName,
    records,
    requiredDataFields,
  );

  console.log(`\n${apiModuleName} API - totalCount ${apiTotal}, fetched ${records.length}, scanned ${scannedCount}\nEndpoint: GET ${endpoint}${report}`);

  expect(apiTotal).toBeGreaterThanOrEqual(records.length);
  expect(scannedCount).toBe(REAL_API_SAMPLE_SIZE);
  expect(report).toContain('first 20 + middle 10 + last 20 - 50');
  expect(report).toContain('PASS');
  expect(report).toContain('FAIL');

  if (failOnGaps && !allPassed) {
    throw new Error(`${report}\n  API totalCount: ${apiTotal}\n  API endpoint under test: GET ${endpoint}`);
  }
}

export async function expectRealFieldConfig(moduleName, requiredHeaderFields) {
  assertApiReachable();

  const endpoint = buildUrl(`${AUTH_URL}/admin/field-config`, { module: moduleName });
  const response = await getFieldConfig(moduleName);
  const fields = getFieldItems(response);
  const { allPassed, report } = buildHeaderFieldsReport(moduleName, fields, requiredHeaderFields);

  console.log(`\n${moduleName} field config API - ${fields.length} fields returned\nEndpoint: GET ${endpoint}`);

  if (!allPassed) {
    throw new Error(`${report}\n  API endpoint under test: GET ${endpoint}`);
  }

  expect(fields.length).toBeGreaterThan(0);
}
