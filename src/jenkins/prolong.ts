import { Fetcher } from '../utils/fetcher.ts';
import { config, path, zealTestsystemUrl } from '../config.ts';
import { fileExists, readFile, writeFile } from '../utils/file.ts';
import { print } from '../utils/log.ts';
import { viewLatestBuild } from '../utils/jenkins.ts';

export const prolong = async ({
  testsystem,
  duration,
  test,
}: {
  testsystem: string;
  duration: number;
  test?: boolean;
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

  const fetch = new Fetcher({
    init: {
      headers: { Authorization: config.jenkins.authorization },
    },
    testmode: test,
  });

  const url = new URL(
    config.jenkins.url + config.jenkins.jobs.prolong + config.jenkins.buildWithParameters
  );

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));
  searchParams.append('NUMBER_OF_HOURS_TO_PROLONG', duration.toString());

  url.search = searchParams.toString();

  await fetch.post(url);

  await writeFile(prolongFile, JSON.stringify({ testsystem, duration, ts: Date.now() }));

  await viewLatestBuild({ fetch, job: config.jenkins.url + config.jenkins.jobs.prolong });
};
