import { fetcher } from '../utils/fetcher.ts';
import { config, zealTestsystemUrl } from '../config.ts';

export const start = async ({ testsystem }: { testsystem: string }) => {
  const url = new URL(config.jenkins.url + config.jenkins.jobs.deployDhrFrontend);

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));

  url.search = searchParams.toString();

  await fetcher(url.toString(), {
    headers: { Authorization: config.jenkins.authorization },
    method: 'POST',
  });
};
