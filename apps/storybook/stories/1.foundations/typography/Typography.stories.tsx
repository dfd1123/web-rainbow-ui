
// import {Typography} from '@repo/rb-components';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { Typography, TYPOGRAPHY_COLORS, TYPOGRAPHY_FONT_STYLES } from '@repo/rb-components';


type StoryComponent = StoryObj<typeof Typography>;
type StoryTemplate = StoryFn<typeof Typography>;

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    type: {
     control: 'select',
     options: Object.keys(TYPOGRAPHY_FONT_STYLES)
    },
    color: {
      control: 'select',
      options: Object.keys(TYPOGRAPHY_COLORS)
    }
  }
} as Meta<typeof Typography>;

const DefaultTemplate: StoryTemplate = (args) => {
  return <Typography {...args} />;
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
    children: 'Typography',
    tag: 'span',
    type: 'text-56-bold'
  },
  render: DefaultTemplate
};

export const TypographyH: StoryComponent = {
  parameters: {
    docs: {
      source: {
        code:
          '\n<TypographyH hLevel={1}>' +
          '\n\h태그를 쓸때는 <TypographyH />를 사용하면 됩니다.' +
          '\n</TypographyH>'
      }
    }
  },
  args: {
    children: 'h 태그를 쓸때는 <TypographyH /> 를 사용하면 됩니다.',
    tag: 'h',
    hLevel: 1
  },
  argTypes: {
    tag: {
      control: false
    }
  },
  render: DefaultTemplate
};

export const TypographyP: StoryComponent = {
  parameters: {
    docs: {
      source: {
        code:
          '\n<TypographyP >' +
          '\n\p태그를 쓸때는 <TypographyP />를 사용하면 됩니다.' +
          '\n</TypographyP>'
      }
    }
  },
  args: {
    children: 'p 태그를 쓸때는 <TypographyP />를 사용하면 됩니다.',
    tag: 'p'
  },
  argTypes: {
    tag: {
      control: false
    },
    hLevel: {
      control: false
    }
  },
  render: DefaultTemplate
};

export const TypographySpan: StoryComponent = {
  parameters: {
    docs: {
      source: {
        code:
          '\n<TypographySpan>' +
          '\n\span태그를 쓸때는 <TypographySpan />를 사용하면 됩니다.' +
          '\n</TypographySpan>'
      }
    }
  },
  args: {
    children: 'span 태그를 쓸때는 <TypographySpan />를 사용하면 됩니다.',
    tag: 'span'
  },
  argTypes: {
    tag: {
      control: false
    },
    hLevel: {
      control: false
    }
  },
  render: DefaultTemplate
};

export const TypographyFont: StoryComponent = {
  parameters: {
    docs: {
      source: {
        code:
          '\n<TypographyFont>' +
          '\n\font태그를 쓸때는 <Typography.Font />를 사용하면 됩니다.' +
          '\n</TypographyFont>'
      }
    }
  },
  args: {
    children: 'font 태그를 쓸때는 <TypographyFont />를 사용하면 됩니다.',
    tag: 'font'
  },
  argTypes: {
    tag: {
      control: false
    },
    hLevel: {
      control: false
    }
  },
  render: DefaultTemplate
};

export const TypographyLabel: StoryComponent = {
  parameters: {
    docs: {
      source: {
        code:
          '\n<TypographyLabel>' +
          '\n\label태그를 쓸때는 <TypographyLabel />를 사용하면 됩니다.' +
          '\n</TypographyLabel>'
      }
    }
  },
  args: {
    children: 'label 태그를 쓸때는 <TypographyLabel />를 사용하면 됩니다.',
    tag: 'label'
  },
  argTypes: {
    tag: {
      control: false
    },
    hLevel: {
      control: false
    }
  },
  render: DefaultTemplate
};

export const TypographyColor: StoryComponent = {
  parameters: {
    docs: {
      source: {
        code:
          '\n<Typography color="static-white">' +
          '\n\t색상은 이렇게 쓸 수 있습니다.' +
          '\n</Typography>'
      }
    }
  },
  args: {
    children: '색상은 이렇게 쓸 수 있습니다.',
    color: 'accent-purple'
  },
  render: DefaultTemplate
};
