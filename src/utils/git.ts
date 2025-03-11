import { execute } from './execute.ts';

export const gitBranches = async () =>
  execute('git', ['branch', '--sort=-committerdate'], { mute: true });
