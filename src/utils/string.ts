import { styleText } from 'node:util';

// TODO: can't import the types from `styleText`, this is a hack
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
export function styleMessage(color: ArgumentTypes<typeof styleText>[0], message: string): string;
export function styleMessage(color: ArgumentTypes<typeof styleText>[0], message: number): string;
export function styleMessage(color: ArgumentTypes<typeof styleText>[0], message: unknown): unknown;
export function styleMessage(color: ArgumentTypes<typeof styleText>[0], message: unknown): unknown {
  if (typeof message === 'string') {
    return styleText(color, message);
  }

  if (typeof message === 'number') {
    return styleText(color, message.toString());
  }

  return message;
}

export const trimWhitespace = (str: string) => str.replace(/^\s+|\s+$/g, '');

export const trimTrailingNewline = (str: string) => str.replace(/[\r\n]+$/, '');
