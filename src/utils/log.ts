/* eslint-disable no-console */
import { color, styleMessage } from './color.ts';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export const logLevels: LogLevel[] = ['error', 'warn', 'info', 'debug'];

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
