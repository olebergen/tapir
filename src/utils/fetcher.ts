import { TapError } from './error.ts';
import { log } from './log.ts';

export const fetcher = async <T = unknown>(url: string, init?: RequestInit) => {
  const response = await fetch(url, init);

  if (!response.ok) {
    return log(new TapError('Failed to fetch', { status: response.status, url }));
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as Promise<T>;
  }
};
