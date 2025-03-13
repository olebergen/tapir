import ora from 'ora';
import { exitWithError, TapError } from './error.ts';
import { print } from './log.ts';
import { styleMessage } from './string.ts';
import { color } from './color.ts';
import { isTestmode } from '../config.ts';

export const fetcher = async <T = unknown>({
  url,
  init,
  testmodeFlag,
}: {
  url: URL;
  init?: RequestInit;
  testmodeFlag?: boolean;
}) => {
  if (isTestmode(testmodeFlag)) {
    const searchParams = new URLSearchParams(url.search);
    let testUrl = 'https://httbin.org/';
    testUrl += init?.method === 'POST' ? 'post' : 'delay/1';
    if (searchParams) testUrl += `?${searchParams}`;
    url = new URL(testUrl);
  }

  const startTime = Date.now();
  const methodAndUrl = `${init?.method ? init.method : 'GET'} ${url}`;
  const spinner = ora(methodAndUrl).start();

  const response = await fetch(url, init);
  let { status }: { status: number | string } = response;

  const responseTime = Date.now() - startTime;

  if (status >= 200 && status < 300) status = styleMessage(color.success, status);
  else if (status >= 300 && status < 400) status = styleMessage(color.warn, status);
  else status = styleMessage(color.error, status);

  const responseLog = `  ${methodAndUrl} ${status} ${responseTime}ms`;

  spinner.stop();

  if (!response.ok) {
    print.info(responseLog);
    exitWithError('Failed to fetch');
  }

  print.info(responseLog);

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as Promise<T>;
  }
};
