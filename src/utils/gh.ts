import { execute } from './execute.ts';

export const currentPathPrNumberJSON = async () =>
  execute('gh', ['pr', 'view', '--json', 'number'], { mute: true });

export const allPrs = async () =>
  execute(
    'gh',
    [
      'pr',
      'ls',
      '--json',
      'number,title',
      '--template',
      '{{range .}}{{tablerow .number .title}}{{end}}',
    ],
    { mute: true }
  );
