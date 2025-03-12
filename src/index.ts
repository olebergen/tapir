import yargs from 'yargs';
import { env, path } from './config.ts';
import { deployDhr } from './jenkins/deployDhr.ts';
import { prolong } from './jenkins/prolong.ts';
import { start } from './jenkins/start.ts';
import { destroy } from './jenkins/destroy.ts';
import { createDir, fileExists } from './utils/file.ts';

(async () => {
  const hasTmp = await fileExists(path.tmp);
  if (!hasTmp) {
    await createDir(path.tmp);
  }

  await yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .demandCommand(1, 'You need to specify a command')
    .strict()
    .options({
      testsystem: { type: 'string', default: env.TESTSYSTEM_HOST, alias: 't' },
    })
    .command({
      command: 'start',
      describe: 'Start a testsystem',
      handler: async (argv) => start({ testsystem: argv.testsystem }),
    })
    .command({
      command: 'destroy',
      describe: 'Delete a testsystem',
      handler: async (argv) => destroy({ testsystem: argv.testsystem }),
    })
    .command({
      command: 'prolong',
      describe: 'Prolong a testsystem',
      builder: (yargs) =>
        yargs.option('duration', {
          type: 'number',
          default: 4,
          alias: 'd',
          describe: 'Specify the duration in hours',
        }),
      handler: async (argv) => prolong({ testsystem: argv.testsystem, duration: argv.duration }),
    })
    .command({
      command: 'dhr',
      describe: 'Deploy DHR Frontend PR',
      builder: (yargs) =>
        yargs
          .options('tag', {
            type: 'string',
            alias: 'T',
            describe: 'Specify the frontend version via tag',
            example: 'PR_1234',
          })
          .option('select', {
            type: 'boolean',
            alias: 's',
            describe: 'Select the PR to deploy',
          })
          .conflicts('tag', 'select'),
      handler: async (argv) => {
        deployDhr({
          select: argv.select,
          testsystem: argv.testsystem,
          tag: argv.tag,
        });
      },
    })
    .help()
    .parse();
})();
