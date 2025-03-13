import { execute } from './execute.ts';
import { print } from './log.ts';

export const canViewPrs = async () => {
  const result = await execute('gh', ['pr', 'ls'], { mute: true });

  if (result.code !== 0) {
    print.error('Something is wrong with your GitHub authentication, check:    gh auth status');
    process.exit(1);
  }

  return true;
};

export const currentPathPrNumberJSON = async () =>
  execute('gh', ['pr', 'view', '--json', 'number'], { mute: true });

export const allPrs = async () =>
  execute('gh', ['pr', 'ls', '--json', 'number,title'], { mute: true });
