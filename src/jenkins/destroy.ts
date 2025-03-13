import { fetcher } from '../utils/fetcher.ts';
import { config, zealTestsystemUrl } from '../config.ts';

export const destroy = async ({ testsystem, test }: { testsystem: string; test?: boolean }) => {
  const url = new URL(config.jenkins.url + config.jenkins.jobs.destroy);

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));

  url.search = searchParams.toString();

  await fetcher({
    url,
    init: {
      headers: { Authorization: config.jenkins.authorization },
      method: 'POST',
    },
    testmodeFlag: test,
  });
};
