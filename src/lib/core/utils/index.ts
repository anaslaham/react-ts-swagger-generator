import _ from "lodash";

// its filter and reduce together :)
export const collect = (objectOrArray, cb) =>
  _.reduce(
    objectOrArray,
    (acc, part, key) => {
      const result = cb(part, key);
      return _.isArray(objectOrArray)
        ? result
          ? [...acc, result]
          : acc
        : result
        ? { ...acc, [key]: result }
        : acc;
    },
    _.isArray(objectOrArray) ? [] : {}
  );
