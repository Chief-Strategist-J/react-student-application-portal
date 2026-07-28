import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationForm } from './index';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { applicationReducer } from './slice';
import { applicantsReducer } from '../applicantsDashboard/slice';
import { uiReducer } from '../../shared/store/uiSlice';
import { INITIAL_APPLICATION_FORM } from './types';

function makeStore(overrides: Partial<ReturnType<typeof applicationReducer>> = {}) {
  return configureStore({
    reducer: { application: applicationReducer, applicants: applicantsReducer, ui: uiReducer },
    preloadedState: {
      application: {
        items: [],
        status: 'idle',
        error: null,
        searchQuery: '',
        sortBy: null,
        sortOrder: 'asc',
        formFields: INITIAL_APPLICATION_FORM,
        saving: false,
        localError: null,
        successMessage: null,
        ...overrides,
      } as any,
    },
  });
}

const meta: Meta<typeof ApplicationForm> = {
  title: 'Features/ApplicationForm',
  component: ApplicationForm,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, { parameters }) => (
      <Provider store={parameters.store ?? makeStore()}>
        <div className="p-6 bg-[#f8f9ff] min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ApplicationForm>;

export const StepOne: Story = {};

export const StepTwo: Story = {
  parameters: {
    store: makeStore({ formFields: { ...INITIAL_APPLICATION_FORM, step: 2, firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', phone: '9876543210', dob: '1990-01-01' } }),
  },
};

export const StepThree: Story = {
  parameters: {
    store: makeStore({ formFields: { ...INITIAL_APPLICATION_FORM, step: 3, firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', phone: '9876543210', dob: '1990-01-01' } }),
  },
};

export const Submitting: Story = {
  parameters: { store: makeStore({ saving: true }) },
};

export const SubmitSuccess: Story = {
  parameters: { store: makeStore({ successMessage: 'Application submitted successfully!' }) },
};

export const SubmitError: Story = {
  parameters: { store: makeStore({ localError: 'Failed to submit. Please try again.' }) },
};

export const DarkMode: Story = {
  decorators: [
    (Story) => {
      document.documentElement.classList.add('dark');
      return (
        <Provider store={makeStore()}>
          <div className="dark p-6 bg-slate-950 min-h-screen">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};
