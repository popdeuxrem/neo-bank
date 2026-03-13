import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent } from '../resources/js/components/Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'gradient'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hover: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <CardContent>This is a default card</CardContent>,
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: <CardContent>This is an elevated card with shadow</CardContent>,
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: <CardContent>This is an outlined card</CardContent>,
  },
};

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    children: <CardContent className="text-white">This is a gradient card</CardContent>,
  },
};

export const WithHeader: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the card content</p>
        </CardContent>
      </>
    ),
  },
};

export const Hoverable: Story = {
  args: {
    hover: true,
    children: <CardContent>Hover over me!</CardContent>,
  },
};
