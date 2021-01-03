import fs from "fs";
import _ from "lodash";
import { createFile, copyFolder } from "./lib/core/files";
import { getTemplate } from "./lib/core/templates/getTemplates";
import { createComponentsMap, filterComponentsMap } from "./lib/interfaces";
import { addToConfig } from "./lib/core/config";
import { getModelType } from "./lib/core/modelTypes";
import { format } from "prettier";
import { parseSchemas, resetDependences } from "./lib/core/schema";
import { groupRoutes, parseRoutes } from "./lib/services";
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
const servicesTemplate = getTemplate("services");
const { info, paths, servers, components } = schema;
const componentsMap = createComponentsMap(components);
const schemasMap = filterComponentsMap(componentsMap, "schemas");
const parsedSchemas = parseSchemas(components);
const routes = parseRoutes(
  schema,
  parsedSchemas,
  componentsMap,
  components,
  3,

  2,
  false
);
const groupedRoutes = groupRoutes(routes);
createFile(`debug`, `/routes.json`, JSON.stringify(groupRoutes(routes)));
const apiName: string = _.camelCase(info.title) ?? "api";
schemasMap.forEach((schema) => {
  const content = interfaceTemplate({
    modelTypes: getModelType(schema),
  });
  createFile(
    `output/${apiName}/interfaces/${getModelType(schema).name}`,
    `/index.ts`,
    format(content, prettierConfig)
  );
  resetDependences();
});
copyFolder(`output`, "static");
createFile(
  `output/${apiName}/config`,
  `/index.ts`,
  format("export default {baseUrl:'' , headers :{}}", prettierConfig)
);
groupedRoutes.combined.forEach((route) => {
  const content = servicesTemplate(route);
  createFile(
    `output/${apiName}/services/${route.moduleName}`,
    `/index.ts`,
    format(content, prettierConfig)
  );
});
