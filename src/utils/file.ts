import fs from 'fs/promises';

export const fileExists = async (path: string) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);
export const writeFile = async (path: string, content: string) => fs.writeFile(path, content);
export const readFile = async (path: string) => fs.readFile(path, 'utf8');
export const createDir = async (path: string) => fs.mkdir(path, { recursive: true });
