import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { join, dirname } from "path"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  docs: {
    autodocs: 'tag'
  },
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath("@storybook/experimental-addon-test")
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {}
  },
  // typescript: {
  //   // 'react-docgen'을 사용하거나 'react-docgen-typescript'와 함께 사용
  //   reactDocgen: 'react-docgen-typescript',
  //   reactDocgenTypescriptOptions: {
  //     // 필요한 props만 표시
  //     propFilter: (prop) => {
  //       if (prop.parent) {
  //         return !prop.parent.fileName.includes('node_modules');
  //       }
  //       return true;
  //     },
  //     // 컴포넌트 설명 표시 개선
  //     shouldExtractLiteralValuesFromEnum: true,
  //     // 타입 정보는 숨기되 설명은 유지
  //     skipChildrenPropWithoutDoc: false,
  //     // JSDoc 주석 처리 개선
  //     shouldRemoveUndefinedFromOptional: true,
  //   },
  // },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()],
      resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
      }
    });
  },
};
export default config;