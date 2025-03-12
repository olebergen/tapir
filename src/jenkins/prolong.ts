import { fetcher } from '../utils/fetcher.ts';
import { config, path, zealTestsystemUrl } from '../config.ts';
import { writeFile } from '../utils/file.ts';

export const prolong = async ({
  testsystem,
  duration,
}: {
  testsystem: string;
  duration: number;
}) => {
  // const prolongUrl = new URL(config.jenkins.url + config.jenkins.jobs.prolong);
  const prolongUrl = new URL('https://httpbin.org/post');

  const searchParams = new URLSearchParams();

  searchParams.append('TESTSYSTEM', zealTestsystemUrl(testsystem));
  searchParams.append('NUMBER_OF_HOURS_TO_PROLONG', duration.toString());

  prolongUrl.search = searchParams.toString();

  await fetcher(prolongUrl.toString(), {
    headers: { Authorization: config.jenkins.authorization },
    method: 'POST',
  });

  await writeFile(
    path.out + '/prolong.json',
    JSON.stringify({ testsystem, duration, ts: Date.now() })
  );
};
