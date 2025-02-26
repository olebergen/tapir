import { styleText } from 'node:util';

export type LogLevel = 'error' | 'warn' | 'info';
export type LogOptions = {
  level?: LogLevel;
};

// TODO: can't import the type `ForegroundColors` from `node:util`
const logWithColor = (color: any, message: unknown) =>
  typeof message === 'string' ? styleText(color, message) : message;

export const log = (message: unknown, options?: LogOptions) => {
  const { level = 'info' } = options ?? {};

  if (level === 'error') {
    return console.error(logWithColor('red', message));
  }

  if (level === 'warn') {
    return console.warn(logWithColor('yellow', message));
  }

  console.log(logWithColor('blue', message));
};
