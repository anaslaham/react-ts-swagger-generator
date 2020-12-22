import validator from "is-my-json-valid/require";
// pass the external schemas as an option

export const validateJson = (json: any): boolean => {
  var validate = validator(json);
  if (validate(json)) {
    return true;
  }
  console.warn(validate.errors);
  return false;
};
