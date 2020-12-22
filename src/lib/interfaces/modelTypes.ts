import _ from "lodash";
import { formatters } from "./typeFormatters";
import { checkAndRenameModelName } from "./modelNames";
import { formatDescription } from "./common";
import { config } from "./config";
import { getTypeData } from "./index";

const CONTENT_KEYWORD = "__CONTENT__";

const contentWrapersByTypeIdentifier = {
  enum: `{\r\n${CONTENT_KEYWORD} \r\n }`,
  interface: `{\r\n${CONTENT_KEYWORD}}`,
  type: `= ${CONTENT_KEYWORD}`,
};
let createdFiles = [];
export const getModelType = (typeInfo) => {
  let {
    typeIdentifier,
    name: originalName,
    content,
    type,
    description,
    dependences,
  } = getTypeData(typeInfo);
  if (config.generateUnionEnums && typeIdentifier === "enum") {
    typeIdentifier = "type";
  }

  if (!contentWrapersByTypeIdentifier[typeIdentifier]) {
    throw new Error(
      `${typeIdentifier} - type identifier is unknown for this utility`
    );
  }

  const resultContent = formatters[type] ? formatters[type](content) : content;
  const name = checkAndRenameModelName(originalName);
  const endContent = _.replace(
    contentWrapersByTypeIdentifier[typeIdentifier],
    CONTENT_KEYWORD,
    resultContent
  );
  return {
    typeIdentifier,
    name,
    rawContent: resultContent,
    description: formatDescription(description),
    content: endContent,
    dependences,
  };
};
