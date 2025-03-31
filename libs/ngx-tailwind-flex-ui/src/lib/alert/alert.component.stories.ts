import { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

// Define a custom type for the Stacked Alerts story args
interface StackedAlertsArgs {
  firstMessage: string;
  firstType: 'success' | 'error' | 'warning' | 'info';
  secondMessage: string;
  secondType: 'success' | 'error' | 'warning' | 'info';
  thirdMessage: string;
  thirdType: 'success' | 'error' | 'warning' | 'info';
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  duration: number;
  animation: 'fade' | 'slide';
}

const meta: Meta<AlertComponent> = {
  title: 'Components/Alert',
  component: AlertComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  argTypes: {
    message: {
      control: 'text',
      description: 'The message to display in the alert',
    },
    type: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
      description: "The type of alert ('success', 'error', 'warning', 'info')",
    },
    duration: {
      control: 'number',
      description:
        'Duration in milliseconds before the alert auto-closes (0 to disable)',
    },
    action: {
      control: 'text',
      description: 'Text for the action button (optional)',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed with a close button',
    },
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
      description: 'Position of the alert on the screen',
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
      description: 'Custom icon name (e.g., "star")',
    },
    iconColor: {
      control: 'select',
      options: [
        'text-red-500',
        'text-green-500',
        'text-blue-500',
        'text-yellow-500',
        'text-purple-500',
        'text-gray-500',
      ],
      description:
        'Custom Tailwind CSS color class for the icon (e.g., text-purple-500)',
    },
    customClass: {
      control: 'select',
      options: [
        '',
        'bg-purple-200 border-purple-500 text-purple-800',
        'bg-blue-200 border-blue-500 text-blue-800',
        'bg-red-200 border-red-500 text-red-800',
        'bg-green-200 border-green-500 text-green-800',
      ],
      description:
        'Custom Tailwind CSS classes to apply to the alert container',
    },
    animation: {
      control: 'select',
      options: ['fade', 'slide'],
      description: 'Animation type for the alert (fade or slide)',
    },
  },
};

export default meta;

type Story = StoryObj<AlertComponent>;

// Stories that directly use AlertComponent inputs
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
    iconColor: 'text-purple-500',
    dismissible: true,
    duration: 5000,
    position: 'top-center',
  },
};

export const CustomActionTemplate: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lib-alert
        [message]="message"
        [type]="type"
        [action]="action"
        [duration]="duration"
        [position]="position"
        [animation]="animation"
      >
        <ng-template #actionTemplate>
          <button
            class="bg-blue-500 text-white px-2 Ascendingly
            (click)="onAction()"
            (keydown.enter)="onAction()"
            (keydown.space)="onAction()"
            [attr.aria-label]="action + ' action'"
            tabindex="0"
          >
            {{ action }}
          </button>
        </ng-template>
      </lib-alert>
    `,
  }),
  args: {
    message: 'Custom action template',
    type: 'info',
    action: 'Confirm',
    duration: 5000,
    position: 'top-right',
    animation: 'slide',
  },
};

// Stacked Alerts story with custom args type
export const StackedAlerts: StoryObj<AlertComponent & StackedAlertsArgs> = {
  render: (args: StackedAlertsArgs) => ({
    props: args,
    template: `
      <lib-alert
        [message]="firstMessage"
        [type]="firstType"
        [position]="position"
        [duration]="duration"
        [animation]="animation"
        [bypassDuplicateCheck]="true"
      ></lib-alert>
      <lib-alert
        [message]="secondMessage"
        [type]="secondType"
        [position]="position"
        [duration]="duration"
        [animation]="animation"
        [bypassDuplicateCheck]="true"
      ></lib-alert>
      <lib-alert
        [message]="thirdMessage"
        [type]="thirdType"
        [position]="position"
        [duration]="duration"
        [animation]="animation"
        [bypassDuplicateCheck]="true"
      ></lib-alert>
    `,
  }),
  args: {
    firstMessage: 'First alert',
    firstType: 'success',
    secondMessage: 'Second alert',
    secondType: 'warning',
    thirdMessage: 'Third alert',
    thirdType: 'error',
    position: 'top-right',
    duration: 50000,
    animation: 'slide',
  } as StackedAlertsArgs,
  argTypes: {
    firstMessage: { control: 'text' },
    firstType: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    secondMessage: { control: 'text' },
    secondType: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    thirdMessage: { control: 'text' },
    thirdType: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
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
    duration: { control: 'number' },
    animation: {
      control: 'select',
      options: ['fade', 'slide'],
    },
  },
};
