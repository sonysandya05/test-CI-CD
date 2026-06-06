import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import JobsPage from '../pages/jobsPage';
import {
  expectRealFieldConfig,
  expectRealModuleDataReport,
  loginRealApi,
  renderModulePage,
} from './moduleListApiTestUtils';

const listViewMocks = vi.hoisted(() => ({
  ListView: vi.fn(({ moduleName }) => (
    <div data-testid={`list-view-${moduleName}`}>ListView module: {moduleName}</div>
  )),
}));

vi.mock('../components/ListView', () => ({
  default: listViewMocks.ListView,
}));

const MODULE_NAME = 'jobs';

const REQUIRED_JOBS_DATA_FIELDS = [
  { keys: ['id', '_id', 'jobId', 'key'], label: 'id / _id / jobId                 (job detail route)' },
  { keys: ['jobTitle', 'title', 'jobs'], label: 'jobTitle / title                 (job title column)' },
  { keys: ['jobStatus', 'status'], label: 'jobStatus / status              (job status column)' },
];

const REQUIRED_JOBS_HEADER_FIELDS = [
  'jobTitle',
  'title',
  'jobs',
  'jobStatus',
  'status',
];

beforeAll(loginRealApi, 15000);

describe('JobsPage common ListView', () => {
  it('renders JobsPage with the common ListView module name', () => {
    renderModulePage(JobsPage);

    expect(screen.getByTestId('list-view-jobs')).toHaveTextContent('ListView module: jobs');
    expect(listViewMocks.ListView).toHaveBeenCalledWith(
      expect.objectContaining({ moduleName: MODULE_NAME }),
      undefined,
    );
  });
});

describe('JobsPage real API data validation', () => {
  it('shows PASS/FAIL counts out of 50 for real jobs API data', async () => {
    await expectRealModuleDataReport(MODULE_NAME, REQUIRED_JOBS_DATA_FIELDS, {
      failOnGaps: true,
      fallbackModuleNames: ['job', 'Job'],
    });
  }, 30000);

  it('loads real jobs field config from API', async () => {
    await expectRealFieldConfig(MODULE_NAME, REQUIRED_JOBS_HEADER_FIELDS);
  }, 30000);
});
