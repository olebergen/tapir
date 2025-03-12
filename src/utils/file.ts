import fs from 'fs/promises';

export const writeFile = async (path: string, content: string) => fs.writeFile(path, content);
export const readFile = async (path: string) => fs.readFile(path, 'utf8');
