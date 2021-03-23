import _ from "lodash";
import { createFile, copyFolder } from "./lib/core/files";
import { createComponentsMap, filterComponentsMap } from "./lib/interfaces";
import { addToConfig } from "./lib/core/config";
import { getModelType } from "./lib/core/modelTypes";
import { format } from "prettier";
import { parseSchemas, resetDependences } from "./lib/core/schema";
import { groupRoutes, parseRoutes } from "./lib/services";
import file from "./lib/test/test-api.json";
const interfaceTemplate = require("./lib/core/templates/interface.handlebars");
const servicesTemplate = require("./lib/core/templates/services.handlebars");
const prettierConfig = {
  printWidth: 120,
  tabWidth: 2,
  trailingComma: "all",
  parser: "typescript",
};
const schema: any = file;
addToConfig({
  swaggerSchema: schema,
  originalSchema: schema,
});
// const interfaceTemplate = getTemplate("interface");
// const servicesTemplate = getTemplate("services");
// const contextTemplate = getTemplate("context");
// const providersTemplate = getTemplate("providers");
const { info, paths, servers, components } = schema;
const componentsMap = createComponentsMap(components);
const schemasMap = filterComponentsMap(componentsMap, "schemas");

const apiName: string = _.camelCase(info.title) ?? "api";
schemasMap.forEach((schema) => {
  const content = interfaceTemplate({
    modelTypes: getModelType(schema),
  });
  createFile(
    `output/${apiName}/interfaces/${getModelType(schema).name}`,
    `/index.ts`,
    content
  );
  resetDependences();
});
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
createFile(`debug`, `/routes.json`, JSON.stringify(groupedRoutes));
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
    content
  );
});

// groupedRoutes.combined.forEach((route) => {
//   const content = contextTemplate(route);
//   createFile(
//     `output/${apiName}/contexts/${route.moduleName}`,
//     `/index.tsx`,
//     format(content, prettierConfig)
//   );
// });

// const providers = parseProviders(groupedRoutes.combined, apiName);
// const content = providersTemplate(providers);
// createFile(
//   `output/${apiName}/providers`,
//   `/index.tsx`,
//   format(content, prettierConfig)
// );
