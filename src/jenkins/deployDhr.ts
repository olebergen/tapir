import prompts from 'prompts';
import { fetcher } from '../utils/fetcher.ts';
import { config, zealTestsystemUrl } from '../config.ts';
import { allPrs, currentPathPrNumberJSON, isGhAuthenticationError } from '../utils/gh.ts';

export const deployDhr = async ({
  testsystem,
  tag,
  select,
}: {
  testsystem: string;
  tag?: string;
  select?: boolean;
}) => {
  let frontendVersion = tag;

  if (select) {
    const prs = await allPrs();

    const authError = isGhAuthenticationError(prs.stderr);
    if (authError) throw new Error('gh authentication error, try:  gh auth login');
    const noPrError = prs.stderr.includes('no pull requests found');
    if (noPrError) throw new Error('No pull request found');

    const choices = JSON.parse(prs.stdout).map(
      ({ number, title }: { number: number; title: string }) => ({
        title: `${number}: ${title}`,
        value: 'PR_' + number,
      })
    );

    const { pr } = await prompts({
      type: 'select',
      name: 'pr',
      message: 'Pick a PR',
      choices,
    });

    if (!pr) throw new Error('No PR selected');

    frontendVersion = pr;
  }

  if (!frontendVersion) {
    const currentPr = await currentPathPrNumberJSON();

    const authError = isGhAuthenticationError(currentPr.stderr);
    if (authError) throw new Error('gh authentication error, try:  gh auth login');
    const noPrError = currentPr.stderr.includes('no pull requests found');
    if (noPrError) throw new Error('No pull request found');

    const prNumber = JSON.parse(currentPr.stdout).number;

    if (typeof prNumber !== 'number') throw new Error('PR number is not a number');

    frontendVersion = 'PR_' + prNumber;
  }

  const url = new URL(config.jenkins.url + config.jenkins.jobs.deployDhrFrontend);

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));
  searchParams.append('DHR_FRONTEND_VERSION', frontendVersion);

  url.search = searchParams.toString();

  await fetcher(url.toString(), {
    headers: { Authorization: config.jenkins.authorization },
    method: 'POST',
  });
};
