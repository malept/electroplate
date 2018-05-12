#!/usr/bin/env node
import fs from 'fs-extra'
import ora from 'ora'
import path from 'path'
import program from 'commander'
import electronForge from 'electron-forge'

program
  .version(require('../package.json').version)
  .option("-u, --url <url>", "url to electroplate")
  .option("-i, --icon <icon>", "icon for package")
  .option("-n, --app-name <name>", "name of app")
  .parse(process.argv)

async function main() {
  console.log(`Electroplating ${program.appName || ""}...`)

  const electroplatedDir = path.resolve("./out");

  if (!await fs.pathExists(electroplatedDir)) {
    await fs.mkdirs(electroplatedDir);
  }

  await electronForge.init({
    interactive: true,
    template: "electroplate",
    dir: electroplatedDir,
  })

  const config = {
    url: program.url
  }
  const productName = program.appName || "electroplated-app"
  const packageJSON = require(path.resolve("out", "package.json"));
  packageJSON.config.forge.electronPackagerConfig.icon = program.icon;
  packageJSON.name = productName;
  packageJSON.productName = productName;
  await fs.writeJson(path.resolve("out", "package.json"), packageJSON);
  await fs.writeJson(path.resolve("out", "config.json"), config);

  console.log("Electroplated!")

  await electronForge.package({
    dir: path.resolve("out"),
    interactive: true
  });

  console.log('Done!')
}
main();
