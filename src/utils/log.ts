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

const logAsJson = (message: string, timestamp?: string) => {
  try {
    print.info(JSON.parse(message));
    if (timestamp) print.info(`at ${timestamp}\n`);
  } catch {
    print.info(timestamp ? `${timestamp} -- ${message}` : message);
  }
};

export const jsonLog = (data: Buffer, parse?: boolean, timestamp?: boolean) => {
  // can contain multiple json objects
  const logs = data
    .toString()
    .split('\n')
    .filter((line) => line.trim() !== '');

  const ts = timestamp
    ? new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        // node DateTimeFormat doesn't have fractionalSecondDigits
        // fractionalSecondDigits: 'numeric',
      }).format(new Date())
    : undefined;

  if (parse) {
    logs.forEach((log) => logAsJson(log, ts));
  } else logs.forEach((log) => print.info(timestamp ? `${ts} -- ${log}` : log));
};
