import yargs from 'yargs';
import { env } from './config.ts';
import { deployDhr } from './jenkins/deployDhr.ts';
import { prolong } from './jenkins/prolong.ts';
import { start } from './jenkins/start.ts';
import { destroy } from './jenkins/destroy.ts';

(async () => {
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
        yargs.option('tag', {
          type: 'string',
          alias: 'T',
          describe: 'Specify the frontend version via tag',
          example: 'PR_1234',
        }),
      handler: async (argv) => {
        deployDhr({
          testsystem: argv.testsystem,
          tag: argv.tag,
        });
      },
    })
    .help()
    .parse();
})();
