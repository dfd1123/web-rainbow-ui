import React from 'react';
import type { Preview } from '@storybook/react';
import { RainbowUiProvider } from '@repo/rb-components/provider';
import { DocsContainer } from '@storybook/addon-docs/blocks';


const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      container: ({ context, children }) => {
        return (
          <RainbowUiProvider>
            <DocsContainer context={context}>
                {children}
            </DocsContainer>
          </RainbowUiProvider>
        
        )
      },
    },
  },
  decorators: [
    (Story) => {


      return (
        <div className={`storybook-font`}>
            <RainbowUiProvider>
              <Story />
            </RainbowUiProvider>
     
        </div>
      )
    }
  ]
};

export default preview;