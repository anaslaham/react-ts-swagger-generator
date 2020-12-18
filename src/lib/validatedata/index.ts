var validator = require("is-my-json-valid/require");
// pass the external schemas as an option
var validate = validator("/schema.json");
export const validateJson = (json: any): boolean => {
  if (validate(json)) {
    return true;
  }
  console.warn(validate.errors);
  return false;
};
