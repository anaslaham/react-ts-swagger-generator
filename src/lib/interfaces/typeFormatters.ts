import _ from "lodash";
import { config } from "../core/config";

export const formatters = {
  enum: (content) =>
    _.map(content, ({ key, value }) =>
      config.generateUnionEnums ? value : `  ${key} = ${value}`
    ).join(config.generateUnionEnums ? " | " : ",\n"),
  intEnum: (content) => _.map(content, ({ value }) => value).join(" | "),
  object: (content) =>
    _.map(content, (part) => {
      const extraSpace = "  ";
      const result = `${extraSpace}${part.field};\n`;

      const comments = _.compact([part.title, part.description]).reduce(
        (acc, comment) => [...acc, ...comment.split(/\n/g)],
        []
      );
      const commonText = comments.length
        ? [
            "",
            ...(comments.length === 1
              ? [`/** ${comments[0]} */`]
              : [
                  "/**",
                  ...comments.map((commentPart) => ` * ${commentPart}`),
                  " */",
                ]),
          ]
            .map((part) => `${extraSpace}${part}\n`)
            .join("")
        : "";

      return `${commonText}${result}`;
    }).join(""),
  type: (content) => {
    return content;
  },
  primitive: (content) => {
    return content;
  },
};

export const inlineExtraFormatters = {
  object: (parsedSchema) => {
    return {
      ...parsedSchema,
      typeIdentifier: parsedSchema.content.length
        ? parsedSchema.typeIdentifier
        : "type",
      content: parsedSchema.content.length
        ? `{ ${parsedSchema.content.map((part) => part.field).join(", ")} }`
        : "object",
    };
  },
  enum: (parsedSchema) => {
    return {
      ...parsedSchema,
      content: _.map(parsedSchema.content, ({ value }) => `${value}`).join(
        " | "
      ),
    };
  },
};
