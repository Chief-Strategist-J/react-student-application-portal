import React from 'react';
import type { Preview } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../src/shared/store/store';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div className="p-4 bg-[#f8f9ff]">
          <Story />
        </div>
      </Provider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
