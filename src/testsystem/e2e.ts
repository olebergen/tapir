import { join } from 'path';
import { path } from '../config.ts';
import { fileExists } from '../utils/file.ts';
import { exitWithError } from '../utils/error.ts';
import { execute } from '../utils/execute.ts';

export const e2e = async ({
  testsystem,
  project,
  ui,
}: {
  testsystem: string;
  project: string;
  ui: boolean;
}) => {
  let baseProjectPath = '.';
  let app_host = '';
  if (project === 'dream-house-raffle' && path.dhr) {
    baseProjectPath = path.dhr;
    app_host = 'www.traumhausverlosung.de';
  }
  if (project === 'freiheitplus' && path.fplus) {
    baseProjectPath = path.fplus;
    app_host = 'www.freiheitplus.de';
  }

  // müssen runter weil nur das monorepo root die binary hat, die node_modules im projekt nicht
  // todo rausnehmen wenn wir frei sind
  const playwrightPath = join(baseProjectPath, '..', '..', 'node_modules', '.bin', 'playwright');

  const hasPlaywright = await fileExists(playwrightPath);

  if (!hasPlaywright) {
    exitWithError(`No playwright found at ${playwrightPath}`);
  }

  await execute(playwrightPath, ['test', ui ? '--ui' : ''], {
    cwd: baseProjectPath,
    env: {
      ...process.env,
      TESTSYSTEM: testsystem,
      APP_HOST: app_host,
    },
    stdio: 'pipe',
  });
};
