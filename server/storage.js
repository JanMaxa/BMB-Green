import path from 'node:path';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';

// Content, settings and uploaded files kept as files under one folder.
export function createFileStorage(root) {
  const filePath = (key) => path.join(root, ...key.split('/'));

  async function readOrNull(file, encoding) {
    try {
      return await readFile(file, encoding);
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  async function write(file, data) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, data);
  }

  return {
    async getJson(key) {
      const text = await readOrNull(`${filePath(key)}.json`, 'utf8');
      return text === null ? null : JSON.parse(text);
    },
    setJson: (key, value) => write(`${filePath(key)}.json`, JSON.stringify(value, null, 2) + '\n'),
    async getFile(key) {
      const data = await readOrNull(filePath(key));
      return data === null ? null : new Uint8Array(data);
    },
    setFile: (key, bytes) => write(filePath(key), bytes),
    async deleteFile(key) {
      try {
        await unlink(filePath(key));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    },
  };
}
