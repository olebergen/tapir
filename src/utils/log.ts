import { styleText } from 'node:util';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// TODO: can't import the types from `styleText`, this is a hack
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
const logWithColor = (color: ArgumentTypes<typeof styleText>[0], message: unknown) =>
  typeof message === 'string' ? styleText(color, message) : message;

export const log = {
  debug: (message: unknown) => {
    console.debug(logWithColor('cyan', message));
  },
  info: (message: unknown) => {
    console.log(message);
  },
  warn: (message: unknown) => {
    console.warn(logWithColor('yellow', message));
  },
  error: (message: unknown) => {
    console.error(logWithColor('red', message));
  },
};
