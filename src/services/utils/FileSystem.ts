import * as fs from 'fs';

export class FileSystem {
  /**
   * Locking file
   */
  static async wait(path: string) {
    let count = 0;
    while (await FileSystem.exists(path)) {
      await FileSystem.later(100);
      count++;
      if (count > 50) {
        console.log('Waiting for a long time!');
      }
    }
  }
  static async lock(path: string) {
    let count = 0;
    while (!(await FileSystem.reserve(path))) {
      await FileSystem.later(100);
      count++;
      if (count > 50) {
        console.log('Locked for a long time!');
      }
    }
  }
  static async unlock(path: string) {
    await FileSystem.delete(path);
  }

  /**
   * Atomic file actions
   */
  static async reserve(path: string) {
    try {
      FileSystem.write(path, undefined, 'wx');
      return true;
    } catch (e) {
      return false;
    }
  }
  static exists(path: string) {
    return new Promise<boolean>((resolve, reject) => {
      fs.access(path, (error: Error | null) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  static write(path: string, data?: Buffer, mode?: string) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, { flag: mode }, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  static read(path: string) {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(path, (error: Error | null, data?: Buffer) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
  static delete(path: string) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  static mkdir(path: string) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, { recursive: true }, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  static list(path: string) {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(path, (error: Error | null, files?: string[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });
  }

  /**
   * Local utils
   */
  private static async later(delay: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }
}
