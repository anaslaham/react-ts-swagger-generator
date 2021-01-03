import _ from "lodash";
import fs from "fs";
import fse from "fs-extra";
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
        console.log("created file ✅");
      });
    })
    .catch(console.error);
};
export const copyFolder = (pathTo: string, src: string) => {
  fs.mkdirSync(`${pathTo}`, { recursive: true });
  fs.promises
    .mkdir(`${pathTo}`, { recursive: true })
    .then(() => {
      fse.copySync(src, pathTo, { overwrite: true }, (err) => {
        if (err) {
          throw err; // add if you want to replace existing folder or file with same name
        } else {
          console.log("the file has been copied ! ✅");
        }
      });
    })
    .catch(console.error);
};
