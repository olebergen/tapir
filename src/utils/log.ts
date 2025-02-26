import { styleText } from 'node:util';

export type LogLevel = 'error' | 'warn' | 'info';
export type LogOptions = {
  level?: LogLevel;
};

export const log = (message: unknown, options?: LogOptions) => {
  const { level = 'info' } = options ?? {};

  if (level === 'error') {
    return console.error(typeof message === 'string' ? styleText('red', message) : message);
  }

  if (level === 'warn') {
    return console.warn(typeof message === 'string' ? styleText('yellow', message) : message);
  }

  console.log(typeof message === 'string' ? styleText('blue', message) : message);
};
