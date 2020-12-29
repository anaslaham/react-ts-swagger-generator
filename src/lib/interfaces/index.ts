import _ from "lodash";
import { addToConfig } from "../core/config";
import { parseSchema } from "../core/schema";
interface IComponentsMap {
  typeName: string;
  componentName: string;
  rawTypeData: any;
}

/* creates a components array */
export const createComponentsMap = (components): IComponentsMap[] => {
  const componentsMap = _.reduce(
    components, //the objects
    //res  value         key
    (map, component, componentName) => {
      //the object     value        key
      _.each(component, (rawTypeData, typeName) => {
        // only map data for now
        map[`#/components/${componentName}/${typeName}`] = {
          typeName,
          rawTypeData,
          componentName,
        };
      });
      //creating an array
      return map;
    },
    {}
  );
  /* adds all the interfaces to the config so we can check if they exist later */
  addToConfig({ componentsMap });
  return componentsMap;
};
/* filter unwanted Componenets the ones that doesn't start with '#/components/ */
export const filterComponentsMap = (
  componentsMap,
  componentName
): IComponentsMap[] =>
  _.filter(componentsMap, (v, ref) =>
    _.startsWith(ref, `#/components/${componentName}`)
  );

/** @returns {{ type, typeIdentifier, name, description, content }} */
export const getTypeData = (typeInfo) => {
  if (!typeInfo.typeData) {
    typeInfo.typeData = parseSchema(typeInfo.rawTypeData, typeInfo.typeName);
  }
  return typeInfo.typeData;
};
