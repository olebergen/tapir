import { spawn, type SpawnOptionsWithoutStdio } from 'child_process';
import { trimTrailingNewline } from './string.ts';

export type ExecuteResult = { stdout: string; stderr: string; code: number | null };

export const execute = (
  command: string,
  args: readonly string[],
  options?: SpawnOptionsWithoutStdio & { mute?: boolean }
): Promise<ExecuteResult> => {
  return new Promise((resolve, reject) => {
    const { mute, ...spawnOptions } = options ?? {};
    const child = spawn(command, args, spawnOptions);
    const buffers: { stdout: Buffer[]; stderr: Buffer[] } = { stdout: [], stderr: [] };

    if (!mute) {
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }

    child.stdout.on('data', (data) => buffers.stdout.push(data));
    child.stderr.on('data', (data) => buffers.stderr.push(data));

    child.on('error', (err) => reject(err));

    child.on('close', (code) => {
      resolve({
        stdout: trimTrailingNewline(Buffer.concat(buffers.stdout).toString()),
        stderr: trimTrailingNewline(Buffer.concat(buffers.stderr).toString()),
        code,
      });
    });
  });
};
