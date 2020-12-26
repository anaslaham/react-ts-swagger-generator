import fs from "fs";
import { createFile } from "./lib/core/files";
import { getTemplate } from "./lib/core/templates/getTemplates";
import { createComponentsMap, filterComponentsMap } from "./lib/interfaces";
import { addToConfig } from "./lib/core/config";
import { getModelType } from "./lib/interfaces/modelTypes";
import { format } from "prettier";
import { resetDependences } from "./lib/interfaces/schema";
const file = fs.readFileSync(`${__dirname}/test/test-api.json`, {
  encoding: "utf8",
});
const prettierConfig = {
  printWidth: 120,
  tabWidth: 2,
  trailingComma: "all",
  parser: "typescript",
};
const schema = JSON.parse(file);
addToConfig({
  swaggerSchema: schema,
  originalSchema: schema,
});
const interfaceTemplate = getTemplate("interface");
const { info, paths, servers, components } = schema;
const componentsMap = createComponentsMap(components);
const schemasMap = filterComponentsMap(componentsMap, "schemas");

schemasMap.forEach((schema) => {
  const content = interfaceTemplate({
    modelTypes: getModelType(schema),
  });
  createFile(
    `output/interfaces/${getModelType(schema).name}`,
    `/index.ts`,
    content
  );
  resetDependences();
});
