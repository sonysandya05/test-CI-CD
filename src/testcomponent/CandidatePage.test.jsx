import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import CandidatePage from '../pages/Modules/Candidates/CandidatePage';
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

const MODULE_NAME = 'candidate';
const FIELD_CONFIG_MODULE_NAME = 'candidates';

const REQUIRED_CANDIDATE_DATA_FIELDS = [
  { keys: ['id', '_id', 'candidateId', 'applicantId', 'key'], label: 'id / _id / candidateId          (candidate detail route)' },
  { keys: ['firstName', 'name', 'candidateName', 'fullName'], label: 'firstName / name                (candidate name column)' },
  { keys: ['email', 'emailId', 'primaryEmail'], label: 'email / emailId                 (candidate email column)' },
  { keys: ['contactNumber', 'phone', 'mobileNumber', 'primaryPhone'], label: 'contactNumber / phone          (candidate phone column)' },
];

const REQUIRED_CANDIDATE_HEADER_FIELDS = [
  'firstName',
  'name',
  'candidateName',
  'email',
  'contactNumber',
  'phone',
];

beforeAll(loginRealApi, 15000);

describe('CandidatePage common ListView', () => {
  it('renders CandidatePage with the common ListView module name', () => {
    renderModulePage(CandidatePage);

    expect(screen.getByTestId('list-view-candidate')).toHaveTextContent('ListView module: candidate');
    expect(listViewMocks.ListView).toHaveBeenCalledWith(
      expect.objectContaining({ moduleName: MODULE_NAME }),
      undefined,
    );
  });
});

describe('CandidatePage real API data validation', () => {
  it('shows PASS/FAIL counts out of 50 for real candidate API data', async () => {
    await expectRealModuleDataReport(MODULE_NAME, REQUIRED_CANDIDATE_DATA_FIELDS, {
      failOnGaps: true,
      fallbackModuleNames: ['candidates', 'Candidate'],
    });
  }, 30000);

  it('loads real candidate field config from API', async () => {
    await expectRealFieldConfig(FIELD_CONFIG_MODULE_NAME, REQUIRED_CANDIDATE_HEADER_FIELDS);
  }, 30000);
});
