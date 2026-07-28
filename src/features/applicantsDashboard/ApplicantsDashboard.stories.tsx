import type { Meta, StoryObj } from '@storybook/react';
import { ApplicantsDashboard } from './index';
import { ApplicantDetailDrawer } from './ApplicantDetailDrawer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { applicantsReducer } from './slice';
import { uiReducer } from '../../shared/store/uiSlice';
import type { Applicant } from './types';

const MOCK_APPLICANTS: Applicant[] = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz', phone: '1-770-736-8031 x56442', website: 'hildegard.org', company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered neural-net' }, address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874', geo: { lat: '-37.3159', lng: '81.1496' } }, status: 'Pending' },
  { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'Shanna@melissa.tv', phone: '010-692-6593 x09125', website: 'anastasia.net', company: { name: 'Deckow-Crist' }, status: 'Under Review' },
  { id: 3, name: 'Clementine Bauch', username: 'Samantha', email: 'Nathan@yesenia.net', phone: '1-463-123-4447', website: 'ramiro.info', company: { name: 'Romaguera-Jacobson' }, status: 'Approved' },
  { id: 4, name: 'Patricia Lebsack', username: 'Karianne', email: 'Julianne.OConner@kory.org', phone: '493-170-9623 x156', website: 'kale.biz', company: { name: 'Robel-Corkery' }, status: 'Waitlisted' },
];

function makeStore(overrides: Partial<ReturnType<typeof applicantsReducer>> = {}) {
  return configureStore({
    reducer: { applicants: applicantsReducer, ui: uiReducer },
    preloadedState: { applicants: { items: [], status: 'idle', error: null, searchQuery: '', sortBy: null, sortOrder: 'asc', formFields: {}, saving: false, localError: null, successMessage: null, ...overrides } as any },
  });
}

const meta: Meta<typeof ApplicantsDashboard> = {
  title: 'Features/ApplicantsDashboard',
  component: ApplicantsDashboard,
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
type Story = StoryObj<typeof ApplicantsDashboard>;

export const Loading: Story = {
  parameters: { store: makeStore({ status: 'loading' }) },
};

export const WithData: Story = {
  parameters: { store: makeStore({ items: MOCK_APPLICANTS, status: 'succeeded' }) },
};

export const Empty: Story = {
  parameters: { store: makeStore({ items: [], status: 'succeeded' }) },
};

export const ErrorState: Story = {
  parameters: { store: makeStore({ status: 'failed', error: 'Failed to fetch applicants from the server.' }) },
};

export const SearchFiltered: Story = {
  parameters: { store: makeStore({ items: MOCK_APPLICANTS, status: 'succeeded', searchQuery: 'Leanne' }) },
};

export const DarkMode: Story = {
  decorators: [
    (Story) => {
      document.documentElement.classList.add('dark');
      return (
        <Provider store={makeStore({ items: MOCK_APPLICANTS, status: 'succeeded' })}>
          <div className="dark p-6 bg-slate-950 min-h-screen">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};


export const DetailDrawerOpen: StoryObj<typeof ApplicantDetailDrawer> = {
  render: () => (
    <ApplicantDetailDrawer
      applicant={MOCK_APPLICANTS[0]}
      onClose={() => console.log('closed')}
    />
  ),
};

export const DetailDrawerDark: StoryObj<typeof ApplicantDetailDrawer> = {
  render: () => (
    <div className="dark">
      <ApplicantDetailDrawer
        applicant={MOCK_APPLICANTS[1]}
        onClose={() => console.log('closed')}
      />
    </div>
  ),
};
