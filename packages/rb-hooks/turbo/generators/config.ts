import * as fs from "fs";

import type { PlopTypes } from "@turbo/gen";

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // A simple generator to add a new React component to the internal UI library
  plop.setGenerator("rb-hook", {
    description: "rb-hook를 추가합니다.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "커스텀 훅 이름을 입력해주세요.",
        filter: (input: string) => {
          return input.startsWith("use") ? input.replace("use", "") : input;
        },
      },
      {
        type: "input",
        name: "path",
        message:
          "커스텀훅을 생성할 src 다음 경로를 입력해주세요. (e.g., a/d/v) (없다면 Enter)",
      },
      {
        type: "input",
        name: "confirmation",
        when: (answers) => {
          const hookPath = `src/${answers.path ? `${answers.path}/` : ""}use${plop.getHelper("pascalCase")(answers.name)}.ts`;

          if (fs.existsSync(hookPath)) {
            throw new Error(`이미 존재하는 훅 입니다: ${hookPath}`);
          }

          return false;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/use{{pascalCase name}}.ts",
        templateFile: "templates/hooks.hbs",
      },
      {
        type: "append",
        path: "src/index.ts",
        template:
          'export { default as use{{pascalCase name}} } from "./use{{pascalCase name}}";',
      },
    ],
  });
}
