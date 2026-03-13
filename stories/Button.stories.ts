import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../resources/js/components/ButtonPrimary';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'outline',
                'ghost',
                'destructive',
                'link',
                'success',
                'gradient',
            ],
        },
        size: {
            control: 'select',
            options: [
                'default',
                'sm',
                'lg',
                'xl',
                'icon',
                'icon-sm',
                'icon-lg',
            ],
        },
        isLoading: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Button',
        variant: 'default',
    },
};

export const Primary: Story = {
    args: {
        children: 'Get Started',
        variant: 'default',
        size: 'lg',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Learn More',
        variant: 'secondary',
        size: 'lg',
    },
};

export const Outline: Story = {
    args: {
        children: 'View Details',
        variant: 'outline',
        size: 'lg',
    },
};

export const Gradient: Story = {
    args: {
        children: 'Start Free Trial',
        variant: 'gradient',
        size: 'lg',
    },
};

export const Loading: Story = {
    args: {
        children: 'Loading...',
        isLoading: true,
    },
};

export const Small: Story = {
    args: {
        children: 'Submit',
        size: 'sm',
    },
};

export const Large: Story = {
    args: {
        children: 'Get Started Now',
        size: 'xl',
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled Button',
        disabled: true,
    },
};
