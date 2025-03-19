import { styleText } from 'node:util';

export const color = {
  debug: 'cyan',
  warn: 'yellow',
  error: 'red',
  success: 'green',
} as const;

type ColorValue = (typeof color)[keyof typeof color];
type ColorKey = keyof typeof color;

export function styleMessage(format: ColorValue | ColorKey, message: string): string;
export function styleMessage(format: ColorValue | ColorKey, message: number): string;
export function styleMessage(format: ColorValue | ColorKey, message: unknown): unknown;
export function styleMessage(format: ColorValue | ColorKey, message: unknown): unknown {
  const c = format in color ? color[format as ColorKey] : (format as ColorValue);
  if (typeof message === 'string') {
    return styleText(c, message);
  }

  if (typeof message === 'number') {
    return styleText(c, message.toString());
  }

  return message;
}
