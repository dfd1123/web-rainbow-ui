import * as fs from "fs";

import type { PlopTypes } from "@turbo/gen";

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("rb-utils", {
    description: "rb-utils를 추가합니다.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "유틸 파일 이름을 입력해주세요.",
      },
      {
        type: "input",
        name: "path",
        message:
          "유틸 파일을 생성할 경로를 입력해주세요. (e.g., a/d/v) (없다면 Enter)",
      },
      {
        type: "input",
        name: "confirmation",
        when: (answers) => {
          const utilsPath = `src/${answers.path ? `${answers.path}/` : ""}${plop.getHelper("camelCase")(answers.name)}.ts`;

          if (fs.existsSync(utilsPath)) {
            throw new Error(`이미 존재하는 유틸 파일입니다: ${utilsPath}`);
          }
          return false;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{#if path}}{{path}}/{{/if}}{{camelCase name}}.ts",
        templateFile: "templates/utils.hbs",
      },
      {
        type: "append",
        path: "package.json",
        pattern: /"exports": {(?<insertion>)/g,
        template:
          '    "./{{#if path}}{{path}}/{{/if}}{{camelCase name}}": "./src/{{#if path}}{{path}}/{{/if}}{{camelCase name}}.ts",',
      },
    ],
  });
}
