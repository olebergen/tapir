import { fetcher } from '../utils/fetcher.ts';
import { config } from '../config.ts';

export const deployDhr = async ({ testsystem, tag }: { testsystem: string; tag?: string }) => {
  let frontendVersion = tag;

  // todo: version from PR number via github api if none specified
  if (!frontendVersion) {
    frontendVersion = 'latest';
  }

  const url = new URL(config.jenkins.url + config.jenkins.jobs.deployDhrFrontend);

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', testsystem);
  searchParams.append('DHR_FRONTEND_VERSION', frontendVersion);
  // searchParams.append('PLATFORM_BRANCH_OR_PR', 'master');

  url.search = searchParams.toString();

  await fetcher(url.toString(), {
    headers: { Authorization: config.jenkins.authorization },
  });
};
