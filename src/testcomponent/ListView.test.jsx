import { ConfigProvider } from 'antd';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ListView from '../components/ListView';

const dropdownApiMocks = vi.hoisted(() => ({
  getModuleDataList: vi.fn(),
}));

vi.mock('../services/dropdownApi', () => ({
  getModuleDataList: dropdownApiMocks.getModuleDataList,
}));

vi.mock('../hooks/useDropdownFields', () => ({
  useFieldConfig: () => ({
    config: [
      { label: 'Job Title', field: 'jobTitle', isVisible: true },
      { label: 'Status', field: 'jobStatus', isVisible: true },
    ],
    loading: false,
    error: null,
  }),
}));

vi.mock('../components/filters/DynamicFieldFilter', () => ({
  default: () => null,
}));

function renderListView() {
  return render(
    <ConfigProvider>
      <MemoryRouter>
        <ListView moduleName="jobs" />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

describe('ListView API total count tabs', () => {
  beforeEach(() => {
    dropdownApiMocks.getModuleDataList.mockResolvedValue({
      totalCount: 67116,
      data: [
        {
          _id: 'job-1',
          jobTitle: 'React Developer',
          jobStatus: 'active',
        },
      ],
    });
  });

  it('shows API totalCount in the default tab when the API does not return tabs', async () => {
    renderListView();

    expect(await screen.findByText('React Developer')).toBeInTheDocument();
    expect(screen.getByText(/jobs/i)).toBeInTheDocument();
    expect(
      [...document.querySelectorAll('.dynamic-tabs-count')]
        .some((element) => element.textContent === '67116'),
    ).toBe(true);
    expect(screen.getByText('Showing 1 - 10 of 67116')).toBeInTheDocument();
  });
});
