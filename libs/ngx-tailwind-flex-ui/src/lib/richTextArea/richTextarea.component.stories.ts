import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { RichTextAreaComponent } from './richTextarea.component';

export default {
  title: 'Components/RichTextArea',
  component: RichTextAreaComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<RichTextAreaComponent>;

const Template: StoryFn<RichTextAreaComponent> = (args) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Type something...',
};
