import type { Preview } from '@storybook/react';
import '../resources/css/app.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F3F5F9',
        },
        {
          name: 'dark',
          value: '#0f1115',
        },
        {
          name: 'surface',
          value: '#FFFFFF',
        },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      return (
        <div
          data-theme={theme}
          className={theme === 'dark' ? 'dark' : ''}
          style={{
            minHeight: '200px',
            padding: '2rem',
            backgroundColor: theme === 'dark' ? '#0f1115' : '#F3F5F9',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
};

export default preview;
