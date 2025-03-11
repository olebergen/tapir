import { fetcher } from '../utils/fetcher.ts';
import { config } from '../config.ts';

export const prolong = async ({
  testsystem,
  duration,
}: {
  testsystem: string;
  duration: number;
}) => {
  const url = new URL(config.jenkins.url + config.jenkins.jobs.prolong);

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', testsystem);
  searchParams.append('NUMBER_OF_HOURS_TO_PROLONG', duration.toString());

  url.search = searchParams.toString();

  await fetcher(url.toString(), {
    headers: { Authorization: config.jenkins.authorization },
  });
};
