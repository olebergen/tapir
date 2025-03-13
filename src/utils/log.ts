/* eslint-disable no-console */
import { color } from './color.ts';
import { styleMessage } from './string.ts';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export const print = {
  debug: (message: unknown) => {
    console.debug(styleMessage(color.debug, message));
  },
  info: (message: unknown) => {
    console.log(message);
  },
  warn: (message: unknown) => {
    console.warn(styleMessage(color.warn, message));
  },
  error: (message: unknown) => {
    console.error(styleMessage(color.error, message));
  },
};
