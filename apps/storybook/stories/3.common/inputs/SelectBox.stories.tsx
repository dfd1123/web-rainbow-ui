import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { SelectBox, Option } from '@repo/rb-components';

type StoryComponent = StoryObj<typeof SelectBox>;
type StoryTemplate = StoryFn<typeof SelectBox>;

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  component: SelectBox,
  tags: ['autodocs']
} as Meta<typeof SelectBox>;

const Template: StoryTemplate = (args) => {
  return (
    <SelectBox {...args}>
      {/* <Option value="test1">TEST1</Option>
      <Option value="test2">TEST2</Option> */}
    </SelectBox>
  );
};

export const Default: StoryComponent = {
  parameters: {
    docs: {
      description: {
        story: ''
      }
    }
  },
  args: {
    placeholder: 'placeholder',
    onClick: undefined
  },
  render: Template
};
