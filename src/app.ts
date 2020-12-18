import { validateJson } from "./lib/validatedata";
import fs from "fs";
const file = fs.readFileSync(`${__dirname}/test/test-api.json`, {
  encoding: "utf8",
});
if (validateJson(JSON.parse(file))) {
  console.log("you");
}
