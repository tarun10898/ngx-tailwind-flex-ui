import { Meta, StoryObj } from '@storybook/angular';
import { TimelineComponent } from './timeline.component';

const meta: Meta<TimelineComponent> = {
  title: 'TimelineComponent',
  component: TimelineComponent,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      defaultValue: 'vertical',
    },
  },
};

export default meta;
type Story = StoryObj<TimelineComponent>;

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    items: [
      {
        label: 'Event 1',
        timestamp: '10:00 AM',
        status: 'completed',
        icon: 'check',
      },
      { label: 'Event 2', timestamp: '12:00 PM', status: 'pending' },
      { label: 'Event 3', timestamp: '2:00 PM', status: 'error' },
    ],
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    items: [
      {
        label: 'Event 1',
        timestamp: '10:00 AM',
        status: 'completed',
        icon: 'check',
      },
      { label: 'Event 2', timestamp: '12:00 PM', status: 'pending' },
      { label: 'Event 3', timestamp: '2:00 PM', status: 'error' },
    ],
  },
};

export const MixedStatus: Story = {
  args: {
    orientation: 'vertical',
    items: [
      {
        label: 'Event 1',
        timestamp: '10:00 AM',
        status: 'completed',
        icon: 'check',
      },
      { label: 'Event 2', timestamp: '12:00 PM', status: 'pending' },
      { label: 'Event 3', timestamp: '2:00 PM', status: 'error' },
    ],
  },
};
