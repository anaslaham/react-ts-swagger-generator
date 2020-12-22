import _ from "lodash";

export const formatDescription = (description, inline?: any) => {
  if (!description) return "";

  let prettified = description;

  prettified = _.replace(prettified, /\*\//g, "*/");

  const hasMultipleLines = _.includes(prettified, "\n");

  if (!hasMultipleLines) return prettified;

  if (inline) {
    return _(prettified)
      .split(/\n/g)
      .map((part) => _.trim(part))
      .compact()
      .join(" ")
      .valueOf();
  }

  return _.replace(prettified, /\n$/g, "");
};
export const toInternalCase = (value) => _.camelCase(_.lowerCase(value));
