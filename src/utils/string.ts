export const trimWhitespace = (str: string) => str.replace(/^\s+|\s+$/g, '');

export const trimTrailingNewline = (str: string) => str.replace(/[\r\n]+$/, '');
