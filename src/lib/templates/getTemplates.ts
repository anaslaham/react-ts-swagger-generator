import Handlebars from "handlebars";
import { getFileContent } from "../files/files";
export const getTemplate = (templateName): HandlebarsTemplateDelegate<any> => {
  const templateText = getFileContent(`${__dirname}/${templateName}.mustache`);
  return Handlebars.compile(templateText);
};
