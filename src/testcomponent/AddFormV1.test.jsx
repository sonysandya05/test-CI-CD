import { ConfigProvider } from 'antd';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AddFormV1 from '../components/AddFormV1';

const dropdownApiMocks = vi.hoisted(() => ({
  getFormGroups: vi.fn(),
}));

vi.mock('../services/dropdownApi', () => ({
  getFormGroups: dropdownApiMocks.getFormGroups,
}));

const formGroups = [
  {
    id: 'personal',
    module: 'candidates',
    name: 'candidate_personal_info',
    label: 'Personal Information',
    addRow: false,
    order: 0,
    fields: [
      {
        label: 'First Name',
        field: 'firstName',
        type: 'text',
        show: 1,
        req: 1,
        edit: 1,
        formatter: 'name',
        validations: [
          { type: 'required', message: 'First name is required' },
          { type: 'min', value: 2, message: 'Minimum 2 characters' },
          { type: 'max', value: 50, message: 'Maximum 50 characters' },
          { type: 'pattern', value: '^[A-Za-z ]+$', message: 'Only alphabets allowed' },
        ],
      },
      {
        label: 'Email',
        field: 'email',
        type: 'email',
        show: 1,
        req: 1,
        edit: 1,
        formatter: 'email',
        validations: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Enter a valid email address' },
        ],
      },
      {
        label: 'Hidden Tracking Code',
        field: 'trackingCode',
        type: 'text',
        show: 0,
        req: 1,
        edit: 1,
      },
    ],
  },
  {
    id: 'professional',
    module: 'candidates',
    name: 'candidate_professional',
    label: 'Professional Details',
    addRow: false,
    order: 1,
    fields: [
      {
        label: 'Years of Experience',
        field: 'yearOfExperience',
        type: 'number',
        show: 1,
        req: 0,
        edit: 1,
        validations: [
          { type: 'min', value: 0, message: 'Cannot be negative' },
          { type: 'max', value: 50, message: 'Maximum 50 years' },
        ],
      },
      {
        label: 'Source',
        field: 'source',
        type: 'select',
        show: 1,
        req: 0,
        edit: 1,
        options: [
          { label: 'LinkedIn', value: 'linkedin' },
          { label: 'Referral', value: 'referral' },
        ],
      },
    ],
  },
];

function renderDynamicForm(props = {}) {
  const onSubmit = props.onSubmit ?? vi.fn();

  render(
    <ConfigProvider>
      <MemoryRouter initialEntries={['/candidates/add']}>
        <Routes>
          <Route
            path="/candidates/add"
            element={(
              <AddFormV1
                moduleName="candidates"
                title="Add Candidate"
                submitText="Create Candidate"
                cancelPath="/candidates"
                onSubmit={onSubmit}
                {...props}
              />
            )}
          />
          <Route path="/candidates" element={<div>Candidate List Page</div>} />
        </Routes>
      </MemoryRouter>
    </ConfigProvider>,
  );

  return { onSubmit };
}

describe('AddFormV1 dynamic API form', () => {
  beforeEach(() => {
    dropdownApiMocks.getFormGroups.mockResolvedValue(formGroups);
  });

  it('calls the dynamic form API and displays only visible fields with labels and inputs', async () => {
    renderDynamicForm();

    expect(dropdownApiMocks.getFormGroups).toHaveBeenCalledWith({ module: 'candidates' });
    expect(await screen.findByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Professional Details')).toBeInTheDocument();

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter first name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByText('Years of Experience')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter years of experience')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Select source')).toBeInTheDocument();

    expect(screen.queryByText('Hidden Tracking Code')).not.toBeInTheDocument();
  });

  it('applies required and optional field behavior on submit', async () => {
    const { onSubmit } = renderDynamicForm();
    const user = userEvent.setup();

    await screen.findByPlaceholderText('Enter first name');
    await user.click(screen.getByRole('button', { name: /create candidate/i }));

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.queryByText('Cannot be negative')).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates fields while typing and honors API maxLength limits', async () => {
    renderDynamicForm();
    const user = userEvent.setup();

    const firstName = await screen.findByPlaceholderText('Enter first name');
    await user.type(firstName, '1');

    expect(await screen.findByText('Minimum 2 characters')).toBeInTheDocument();
    expect(firstName).toHaveAttribute('maxlength', '50');
  });

  it('submits valid dynamic form values', async () => {
    const { onSubmit } = renderDynamicForm();
    const user = userEvent.setup();

    await user.type(await screen.findByPlaceholderText('Enter first name'), 'Ana');
    await user.type(screen.getByPlaceholderText('Enter email'), 'ana@example.com');
    await user.type(screen.getByPlaceholderText('Enter years of experience'), '5');
    await user.click(screen.getByRole('button', { name: /create candidate/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Ana',
        email: 'ana@example.com',
        yearOfExperience: '5',
      }));
    });
  });

  it('navigates to cancelPath when cancel is clicked', async () => {
    renderDynamicForm();
    const user = userEvent.setup();

    await screen.findByPlaceholderText('Enter first name');
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(await screen.findByText('Candidate List Page')).toBeInTheDocument();
  });
});
