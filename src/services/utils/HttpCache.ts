import axios from "axios";

import { promises as fs } from "fs";

import { URL } from "url";

const debug = true;

export class HttpCache {
  private static readonly directory = "./cache";

  private static simplify(url: string) {
    const parsed = new URL(url);
    let cleaned = parsed.hostname + "-" + parsed.pathname;
    cleaned = cleaned.replace(/\//g, "-");
    cleaned = cleaned.replace(/\:/g, "-");
    cleaned = cleaned.replace(/\./g, "-");
    cleaned = cleaned.replace(/\-\-/g, "-");
    cleaned = cleaned.replace(/\-\-/g, "-");
    return cleaned;
  }

  public static async get(url: string, extension: string, code: string) {
    const hash = HttpCache.simplify(url) + "-" + code;
    const path = HttpCache.directory + "/" + hash + "." + (extension ?? "txt");
    await fs.mkdir(HttpCache.directory, { recursive: true });
    try {
      const buffer = await fs.readFile(path);
      if (debug) {
        console.log(">> Cache hit", url);
      }
      const data = buffer.toString();
      return data;
    } catch (e) {
      if (debug) {
        console.log(">> Cache MISS", url);
      }
      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });
      const data: string = response.data.toString();
      try {
        await fs.writeFile(path, data);
      } catch (e) {
        console.error("Could not save", e);
      }
      return data;
    }
  }
}
