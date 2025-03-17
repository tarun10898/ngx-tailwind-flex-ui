import { Meta, StoryObj } from '@storybook/angular';
import { PhoneInputComponent } from './phone-input.component';

const meta: Meta<PhoneInputComponent> = {
  title: 'Components/PhoneInput',
  component: PhoneInputComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: `<div class="p-4">${story().template}</div>`,
    }),
  ],
  argTypes: {
    country: {
      control: 'text',
      description: 'ISO country code (e.g., US, IN)',
    },
    showCountryCode: {
      control: 'boolean',
      description: 'Show country code prefix',
    },
    showCountryFlag: {
      control: 'boolean',
      description: 'Show country flag prefix',
    },
    format: {
      control: 'select',
      options: ['e164', 'international', 'national'],
      description: 'Output format',
    },
    disableDropdown: {
      control: 'boolean',
      description: 'Disable country dropdown',
    },
    disableFormatting: {
      control: 'boolean',
      description: 'Disable auto-formatting',
    },
    displayStyle: {
      control: 'select',
      options: ['inline', 'stacked'],
      description: 'Display layout',
    },
  },
};

export default meta;

type Story = StoryObj<PhoneInputComponent>;

export const Default: Story = {
  args: {
    country: 'US',
    format: 'international',
  },
};

export const FixedCountryIndia: Story = {
  args: {
    country: 'IN',
    showCountryCode: true,
    disableDropdown: true,
  },
};

export const WithFlag: Story = {
  args: {
    country: 'GB',
    showCountryFlag: true,
  },
};

export const NationalFormat: Story = {
  args: {
    country: 'US',
    format: 'national',
  },
};

export const NoFormatting: Story = {
  args: {
    country: 'US',
    disableFormatting: true,
  },
};

export const StackedLayout: Story = {
  args: {
    country: 'US',
    displayStyle: 'stacked',
  },
};
