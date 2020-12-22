import _ from "lodash";
import fs from "fs";

export const getFileContent = (path: string) =>
  fs.readFileSync(path, { encoding: "utf8" });

export const pathIsExist = (path) => path && fs.existsSync(path);

export const createFile = (
  pathTo: string,
  fileName: string,
  content: string
) => {
  fs.mkdirSync(`${pathTo}`, { recursive: true });
  fs.promises
    .mkdir(`${pathTo}`, { recursive: true })
    .then(() => {
      fs.writeFile(`${pathTo}` + fileName, content, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    })
    .catch(console.error);
};
