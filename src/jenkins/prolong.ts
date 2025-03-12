import { fetcher } from '../utils/fetcher.ts';
import { config, path, zealTestsystemUrl } from '../config.ts';
import { fileExists, readFile, writeFile } from '../utils/file.ts';
import { print } from '../utils/log.ts';

export const prolong = async ({
  testsystem,
  duration,
}: {
  testsystem: string;
  duration: number;
}) => {
  const prolongFile = `${path.tmp}/${testsystem}-prolong.json`;
  const previousProlong = await fileExists(prolongFile);

  if (previousProlong) {
    const { ts } = JSON.parse(await readFile(prolongFile));
    const timestamp = new Date(ts);
    const today = new Date();

    if (timestamp.toDateString() === today.toDateString()) {
      print.warn('Already prolonged today');
      process.exit(1);
    }
  }

  const prolongUrl = new URL(config.jenkins.url + config.jenkins.jobs.prolong);

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));
  searchParams.append('NUMBER_OF_HOURS_TO_PROLONG', duration.toString());

  prolongUrl.search = searchParams.toString();

  await fetcher(prolongUrl.toString(), {
    headers: { Authorization: config.jenkins.authorization },
    method: 'POST',
  });

  await writeFile(prolongFile, JSON.stringify({ testsystem, duration, ts: Date.now() }));
};
