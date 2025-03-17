import yargs from 'yargs';
import { env, path } from './config.ts';
import { deployDhr } from './jenkins/deployDhr.ts';
import { prolong } from './jenkins/prolong.ts';
import { start } from './jenkins/start.ts';
import { destroy } from './jenkins/destroy.ts';
import { createDir, fileExists } from './utils/file.ts';

export const init = async () =>
  yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .demandCommand(1, 'You need to specify a command')
    .strict()
    .options({
      test: { type: 'boolean', default: false, describe: 'Use test mode' },
    })
    .options({
      testsystem: {
        type: 'string',
        default: env.TESTSYSTEM_HOST,
        alias: 't',
        describe: 'Testsystem host',
      } as const,
    })
    .command({
      command: 'start',
      describe: 'Start a testsystem',
      handler: async (argv) => start({ testsystem: argv.testsystem, test: argv.test }),
    })
    .command({
      command: 'destroy',
      describe: 'Delete a testsystem',
      handler: async (argv) => destroy({ testsystem: argv.testsystem, test: argv.test }),
    })
    .command({
      command: 'prolong',
      describe: 'Prolong a testsystem',
      builder: (y) =>
        y.option('duration', {
          type: 'number',
          default: 4,
          alias: 'd',
          describe: 'Duration to prolong in hours',
        }),
      handler: async (argv) =>
        prolong({ testsystem: argv.testsystem, duration: argv.duration, test: argv.test }),
    })
    .command({
      command: 'dhr',
      describe: 'Deploy DHR Frontend PR',
      builder: (y) =>
        y
          .options('tag', {
            type: 'string',
            alias: 'T',
            describe: 'DHR frontend version tag, `PR_` followed by a PR number',
            example: 'PR_1234',
          })
          .option('select', {
            type: 'boolean',
            alias: 's',
            describe: 'Select the PR to deploy',
          })
          .conflicts('tag', 'select')
          .option('platformBranchOrPr', {
            type: 'string',
            alias: 'p',
            describe: 'Platform branch or PR to deploy',
            default: 'master',
          }),
      handler: async (argv) => {
        deployDhr({
          select: argv.select,
          testsystem: argv.testsystem,
          tag: argv.tag,
          test: argv.test,
          platformBranchOrPr: argv.platformBranchOrPr,
        });
      },
    })
    .help()
    .parse();

(async () => {
  const hasTmp = await fileExists(path.tmp);
  if (!hasTmp) await createDir(path.tmp);

  await init();
})();
