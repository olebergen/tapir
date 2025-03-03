import { spawn, type SpawnOptionsWithoutStdio } from 'child_process';

export const execute = (
  command: string,
  args: readonly string[],
  options?: SpawnOptionsWithoutStdio
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    const buffers = { stdout: [], stderr: [] };

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.stdout.on('data', (data) => buffers.stdout.push(data));
    child.stderr.on('data', (data) => buffers.stderr.push(data));

    child.on('error', (err) => reject(err));

    child.on('close', () => {
      resolve({
        stdout: Buffer.concat(buffers.stdout).toString(),
        stderr: Buffer.concat(buffers.stderr).toString(),
      });
    });
  });
};
