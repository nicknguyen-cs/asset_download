import * as fs from "fs";
import * as https from "https";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { getContentstackClient, Stack } from "./stack";

async function downloadAssets(target: string) {
  let count = 1;
  let managmentStack = getContentstackClient();
  Stack.Assets()
    .Query()
    .includeCount()
    .toJSON()
    .find()
    .then((data) => {
      const assetCount = data[1];
      console.log(`Total assets: ${assetCount}`);
      const pages = assetCount / 50;
      for (let i = 0; i < pages; i++) {
        Stack.Assets()
          .Query()
          .skip(i * 50)
          .limit(50)
          .toJSON()
          .find()
          .then((data) => {
            data[0].forEach((asset: any) => {
              managmentStack
                .asset(asset.uid)
                .fetch()
                .then((asset) => {
                  managmentStack
                    .asset()
                    .folder(asset.parent_uid)
                    .fetch()
                    .then((folder) => {
                      const pathParts: [] = asset.url.split("/");
                      const targetPath = `${target}/${folder.name}`;
                      const targetFile = `${target}/${folder.name}/${pathParts
                        .slice(pathParts.length -1)}`
                      console.log(targetPath, targetFile);
                      fs.mkdirSync(targetPath, { recursive: true });
                      download(count, assetCount, asset.url, targetFile);
                      count++;
                    });
                });
            });
          });
      }
    });
}

const download = (
  count: number,
  total: number,
  uri: string,
  filename: string,
  quality: number = 50
) => {
  const file = fs.createWriteStream(filename);
  const url = uri.endsWith(".png")
    ? `${uri}?format=jpeg&quality${quality}`
    : uri;
  const request = https.get(url, function (response) {
    response.pipe(file);
    file.on("finish", () => {
      file.close();
      console.log(`Download [${count}/${total}] - [${url}] Completed.`);
    });
  });
};
downloadAssets(process.env.FILE_PATH);
