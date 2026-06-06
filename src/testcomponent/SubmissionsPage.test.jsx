import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import SubmissionsPage from '../pages/Modules/SubmissionsPage';
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

const MODULE_NAME = 'submissions';

const REQUIRED_SUBMISSIONS_DATA_FIELDS = [
  { keys: ['id', '_id', 'submissionId', 'key'], label: 'id / _id / submissionId         (submission row id)' },
  { keys: ['firstName', 'candidateName', 'candidate', 'applicantName', 'name'], label: 'firstName / candidateName       (submission candidate column)' },
  { keys: ['email', 'emailId', 'primaryEmail'], label: 'email / emailId                 (submission email column)' },
  { keys: ['contactNumber', 'phone', 'mobileNumber'], label: 'contactNumber / phone          (submission phone column)' },
  { keys: ['jobTitle', 'job', 'jobs', 'title'], label: 'jobTitle / job                  (submission job column)' },
];

const REQUIRED_SUBMISSIONS_HEADER_FIELDS = [
  'firstName',
  'candidateName',
  'candidate',
  'email',
  'contactNumber',
  'jobTitle',
  'job',
];

beforeAll(loginRealApi, 15000);

describe('SubmissionsPage common ListView', () => {
  it('renders SubmissionsPage with the common ListView module name', () => {
    renderModulePage(SubmissionsPage);

    expect(screen.getByTestId('list-view-submissions')).toHaveTextContent('ListView module: submissions');
    expect(listViewMocks.ListView).toHaveBeenCalledWith(
      expect.objectContaining({ moduleName: MODULE_NAME }),
      undefined,
    );
  });
});

describe('SubmissionsPage real API data validation', () => {
  it('shows PASS/FAIL counts out of 50 for real submissions API data', async () => {
    await expectRealModuleDataReport(MODULE_NAME, REQUIRED_SUBMISSIONS_DATA_FIELDS, {
      failOnGaps: true,
    });
  }, 30000);

  it('loads real submissions field config from API', async () => {
    await expectRealFieldConfig(MODULE_NAME, REQUIRED_SUBMISSIONS_HEADER_FIELDS);
  }, 30000);
});
