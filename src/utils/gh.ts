import { execute } from './execute.ts';

export const isGhAuthenticationError = (message: string) => message.includes('HTTP 401:');

export const currentPathPrNumberJSON = async () =>
  execute('gh', ['pr', 'view', '--json', 'number'], { mute: true });

export const allPrs = async () =>
  execute('gh', ['pr', 'ls', '--json', 'number,title'], { mute: true });
