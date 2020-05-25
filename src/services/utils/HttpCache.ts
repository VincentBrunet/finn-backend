import axios from 'axios';

import { FileSystem } from './FileSystem';

import { URL } from 'url';

const debug = false;

export class HttpCache {
  private static readonly directory = './cache';

  static async prepare() {
    await FileSystem.mkdir(HttpCache.directory);
    const files = await FileSystem.list(HttpCache.directory);
    for (const file of files) {
      if (file.endsWith('.lock')) {
        if (debug) {
          console.log('HTTP-CACHE >> CLEANUP >>', file);
        }
        await FileSystem.delete(`${HttpCache.directory}/${file}`);
      }
    }
  }

  static async getNoThrow(url: string, extension: string, code: string) {
    try {
      return await HttpCache.get(url, extension, code);
    } catch (e) {
      console.log('Http fail', url, e);
      return undefined;
    }
  }
  static async get(url: string, extension: string, code: string) {
    const simplified = HttpCache.simplify(url);
    const path = `${HttpCache.directory}/${simplified}-${code}.${extension}`;
    const lock = path + '.lock';

    await FileSystem.mkdir(HttpCache.directory);
    await FileSystem.wait(lock);

    let data: string;
    try {
      const buffer = await FileSystem.read(path);
      if (debug) {
        console.log('HTTP-CACHE >> HIT! >>', url);
      }
      data = buffer.toString();
    } catch (e) {
      try {
        await FileSystem.lock(lock);
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
        });
        const buffer = response.data;
        if (debug) {
          console.log('HTTP-CACHE >> MISS >>', url);
        }
        data = buffer.toString();
        await FileSystem.write(path, buffer);
        await FileSystem.unlock(lock);
      } catch (e) {
        await FileSystem.unlock(lock);
        throw e;
      }
    }
    return data;
  }

  private static simplify(url: string) {
    const parsed = new URL(url);
    let cleaned = parsed.hostname + '-' + parsed.pathname;
    cleaned = cleaned.replace(/\//g, '-');
    cleaned = cleaned.replace(/\:/g, '-');
    cleaned = cleaned.replace(/\./g, '-');
    cleaned = cleaned.replace(/\-\-/g, '-');
    cleaned = cleaned.replace(/\-\-/g, '-');
    return cleaned;
  }
}
