import { config } from '../config.ts';
import type { JenkinsBuild } from '../types/jenkins.ts';
import { exitWithError } from './error.ts';
import type { Fetcher } from './fetcher.ts';
import { print } from './log.ts';

export const viewLatestBuild = async ({ fetch, job }: { fetch: Fetcher; job: string }) => {
  const builds = await fetch.get<{ builds: JenkinsBuild[] }>(new URL(job + config.jenkins.builds));

  if (!Array.isArray(builds.builds) || builds.builds.length === 0) {
    exitWithError('No builds found');
  }

  const [latestBuild] = builds.builds;

  if (latestBuild.result === 'SUCCESS' && latestBuild.url) {
    print.info('view build at ' + latestBuild.url);
  }
};
