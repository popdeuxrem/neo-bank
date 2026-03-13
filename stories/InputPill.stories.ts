import type { Meta, StoryObj } from '@storybook/react';
import { InputPill } from '../resources/js/components/InputPill';
import { Mail } from 'lucide-react';

const meta: Meta<typeof InputPill> = {
  title: 'Components/InputPill',
  component: InputPill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputPill>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your email',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: 'Enter your email',
    icon: <Mail className="h-5 w-5" />,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
  },
};
