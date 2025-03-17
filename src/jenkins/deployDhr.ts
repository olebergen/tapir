import prompts from 'prompts';
import { fetcher } from '../utils/fetcher.ts';
import { config, zealTestsystemUrl } from '../config.ts';
import { allPrs, canViewPrs, currentPathPrNumberJSON } from '../utils/gh.ts';
import { exitWithError } from '../utils/error.ts';

export const deployDhr = async ({
  testsystem,
  tag,
  select,
  test,
  platformBranchOrPr,
}: {
  testsystem: string;
  tag?: string;
  select?: boolean;
  test?: boolean;
  platformBranchOrPr?: string;
}) => {
  await canViewPrs();

  let frontendVersion = tag;

  if (select) {
    const prs = await allPrs();
    if (prs.code !== 0) {
      exitWithError(prs.stderr);
    }

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

    if (!pr) {
      process.exit(1);
    }

    frontendVersion = pr;
  }

  if (!frontendVersion) {
    const currentPr = await currentPathPrNumberJSON();
    if (currentPr.code !== 0) {
      exitWithError(currentPr.stderr);
    }

    const prNumber = JSON.parse(currentPr.stdout).number;

    if (typeof prNumber !== 'number') {
      exitWithError('PR number is not a number');
    }

    frontendVersion = 'PR_' + prNumber;
  }

  const url = new URL(config.jenkins.url + config.jenkins.jobs.deployDhrFrontend);

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));
  searchParams.append('DHR_FRONTEND_VERSION', frontendVersion);
  searchParams.append('PLATFORM_BRANCH_OR_PR', platformBranchOrPr);

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
