import { styleText } from 'node:util';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type LogOptions = {
  level?: LogLevel;
};

// TODO: can't import the types from `styleText`, this is a hack
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
const logWithColor = (color: ArgumentTypes<typeof styleText>[0], message: unknown) =>
  typeof message === 'string' ? styleText(color, message) : message;

export const log = (message: unknown, options?: LogOptions) => {
  const { level = 'info' } = options ?? {};

  if (level === 'info') {
    return console.log(message);
  }

  if (level === 'warn') {
    return console.warn(logWithColor('yellow', message));
  }

  if (level === 'debug') {
    return console.debug(logWithColor('cyan', message));
  }

  console.error(logWithColor('red', message));
};

export const infoLog = (message: unknown) => log(message, { level: 'info' });
export const warningLog = (message: unknown) => log(message, { level: 'warn' });
export const errorLog = (message: unknown) => log(message, { level: 'error' });
