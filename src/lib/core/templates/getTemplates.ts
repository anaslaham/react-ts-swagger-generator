import Handlebars from "handlebars";
import { getFileContent } from "../files";
export const getTemplate = (templateName): HandlebarsTemplateDelegate<any> => {
  const templateText = getFileContent(
    `${__dirname}/${templateName}.handlebars`
  );
  return Handlebars.compile(templateText);
};
