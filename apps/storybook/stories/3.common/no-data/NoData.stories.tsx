import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { NoData } from '@repo/rb-components';

type StoryComponent = StoryObj<typeof NoData>;
type StoryTemplate = StoryFn<typeof NoData>;

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  component: NoData,
  tags: ['autodocs']
} as Meta<typeof NoData>;

const Template: StoryTemplate = (args) => {
  return <NoData {...args} />;
};

export const Default: StoryComponent = {
  parameters: {
    docs: {
      description: {
        story: ''
      }
    }
  },
  args: {},
  render: Template
};
