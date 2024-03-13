import { inlineSource } from "inline-source";
import fs from "fs-extra";
import path from "node:path";

const rootpath = path.resolve("dist");
const htmlpath = path.resolve("dist/index.html");

try {
  const html = await inlineSource(htmlpath, {
    compress: true,
    rootpath,
  });
  console.log("Compeleted.");
  fs.writeFileSync(htmlpath, html);
  // fs.removeSync(`${rootpath}/assets`);
} catch (err) {
  console.error(err);
}
