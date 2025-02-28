import { execute } from './execute.ts';

export const gitBranches = execute('git', ['branch', '--sort=-committerdate']);
