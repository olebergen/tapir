import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { log } from './log';

export const execute = (
  command: string,
  args: readonly string[],
  options?: SpawnOptionsWithoutStdio
) => {
  const { stdout, stderr } = spawn(command, args, options);

  let result = '';

  stdout.on('data', (chunk) => {
    result += chunk;
    log(chunk);
  });

  stderr.on('data', (chunk) => {
    if (result) result += '\n';
    result += chunk;
    log(chunk, { level: 'error' });
  });

  return result;
};
