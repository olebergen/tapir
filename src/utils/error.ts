import { print } from './log.ts';

export const exitWithError = (message: string) => {
  print.error(message);
  process.exit(1);
};
