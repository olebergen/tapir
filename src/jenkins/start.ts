import { Fetcher } from '../utils/fetcher.ts';
import { config, zealTestsystemUrl } from '../config.ts';
import { viewLatestBuild } from '../utils/jenkins.ts';

export const start = async ({ testsystem, test }: { testsystem: string; test?: boolean }) => {
  const fetch = new Fetcher({
    init: {
      headers: { Authorization: config.jenkins.authorization },
    },
    testmode: test,
  });

  const url = new URL(
    config.jenkins.url + config.jenkins.jobs.start + config.jenkins.buildWithParameters
  );

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));

  url.search = searchParams.toString();

  await fetch.post(url);

  await viewLatestBuild({ fetch, job: config.jenkins.url + config.jenkins.jobs.start });
};
