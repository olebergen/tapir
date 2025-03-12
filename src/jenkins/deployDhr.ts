import { fetcher } from '../utils/fetcher.ts';
import { config, zealTestsystemUrl } from '../config.ts';
import { currentPathPrNumberJSON, isGhAuthenticationError } from '../utils/gh.ts';

export const deployDhr = async ({ testsystem, tag }: { testsystem: string; tag?: string }) => {
  let frontendVersion = tag;

  if (!frontendVersion) {
    const currentPr = await currentPathPrNumberJSON();
    const authError = isGhAuthenticationError(currentPr.stderr);
    if (authError) throw new Error('gh authentication error, try:  gh auth login');

    const prNumber = JSON.parse(currentPr.stdout).number;

    if (typeof prNumber !== 'number') throw new Error('PR number is not a number');

    frontendVersion = 'PR_' + prNumber;
  }

  const url = new URL(config.jenkins.url + config.jenkins.jobs.deployDhrFrontend);

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));
  searchParams.append('DHR_FRONTEND_VERSION', frontendVersion);
  // searchParams.append('PLATFORM_BRANCH_OR_PR', 'master');

  url.search = searchParams.toString();

  await fetcher(url.toString(), {
    headers: { Authorization: config.jenkins.authorization },
    method: 'POST',
  });
};
