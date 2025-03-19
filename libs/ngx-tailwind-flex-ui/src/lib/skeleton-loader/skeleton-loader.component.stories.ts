import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { SkeletonLoaderComponent } from './skeleton-loader.component';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';

const meta: Meta<SkeletonLoaderComponent> = {
  title: 'Components/SkeletonLoader',
  component: SkeletonLoaderComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(CommonModule)],
    }),
  ],
  argTypes: {
    type: { control: 'select', options: ['text', 'circle', 'rect'] },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'shimmer', 'fade', 'bounce', 'none'],
    },
    color: {
      control: 'select',
      options: ['bg-gray-200', 'bg-blue-300', 'bg-green-500', 'bg-red-500'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
    size: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<SkeletonLoaderComponent>;

export const Default: Story = {
  args: {
    type: 'rect',
    width: '100%',
    height: '10px',
    animation: 'pulse',
    color: 'bg-blue-300',
  },
  render: (args) => ({
    props: args,
    template: `<lib-skeleton-loader
      [type]="type"
      [width]="width"
      [height]="height"
      [size]="size"
      [animation]="animation"
      [color]="color"
    ></lib-skeleton-loader>`,
  }),
};

export const Circle: Story = {
  args: {
    type: 'circle',
    size: '40px',
    animation: 'wave',
    color: 'bg-green-500',
  },
  render: (args) => ({
    props: args,
    template: `<lib-skeleton-loader
      [type]="type"
      [size]="size"
      [animation]="animation"
      [color]="color"
    ></lib-skeleton-loader>`,
  }),
};
