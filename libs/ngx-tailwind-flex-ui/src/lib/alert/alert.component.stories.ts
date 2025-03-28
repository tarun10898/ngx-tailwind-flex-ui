import { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';
import { applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core'; // Import importProvidersFrom
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<AlertComponent> = {
  title: 'Components/Alert',
  component: AlertComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)], // Use importProvidersFrom
    }),
  ],
  argTypes: {
    message: { control: 'text' },
    type: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
    duration: { control: 'number' },
    action: { control: 'text' },
    dismissible: { control: 'boolean' },
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
    icon: {
      control: 'select',
      options: [
        '',
        'pizza',
        'mood',
        'star',
        'favorite',
        'thumb_up',
        'lightbulb',
        'coffee',
        'cloud',
        'music_note',
        'pets',
        'rocket',
        'beach_access',
      ],
    },
  },
};

export default meta;

type Story = StoryObj<AlertComponent>;

export const BasicSnackBar: Story = {
  args: {
    message: 'Disco party!',
    type: 'info',
    action: 'Dance',
    duration: 5000,
    position: 'bottom-center',
  },
};

export const ConfigurablePosition: Story = {
  args: {
    message: 'Pool party!',
    type: 'info',
    duration: 5000,
    position: 'bottom-right',
  },
};

export const DismissibleError: Story = {
  args: {
    message: 'Something went wrong',
    type: 'error',
    dismissible: true,
    duration: 0,
    position: 'top-right',
  },
};

export const SuccessWithAction: Story = {
  args: {
    message: 'Data saved successfully',
    type: 'success',
    action: 'Undo',
    duration: 3000,
    position: 'bottom-center',
  },
};

export const WarningWithCustomIcon: Story = {
  args: {
    message: 'Custom icon alert',
    type: 'warning',
    icon: 'star',
    dismissible: true,
    duration: 5000,
    position: 'top-center',
  },
};
