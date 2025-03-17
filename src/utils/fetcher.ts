import ora from 'ora';
import { exitWithError } from './error.ts';
import { print } from './log.ts';
import { styleMessage } from './string.ts';
import { color } from './color.ts';
import { isTestmode } from '../config.ts';

export class Fetcher {
  private baseInit?: RequestInit;
  private testmode?: boolean;

  constructor({ init, testmode }: { init?: RequestInit; testmode?: boolean } = {}) {
    this.baseInit = init;
    this.testmode = testmode;
  }

  private async request<T>(url: string | URL | URL, init?: RequestInit): Promise<T> {
    let input: URL = typeof url === 'string' ? new URL(url) : url;

    if (isTestmode(this.testmode)) {
      const searchParams = new URLSearchParams(input.search);
      let testUrl = 'https://httpbin.org/';
      testUrl += init?.method === 'POST' ? 'post' : 'delay/1';
      if (searchParams.toString()) testUrl += `?${searchParams}`;
      input = new URL(testUrl);
    }

    const startTime = Date.now();
    const statusLog = `${init?.method || 'GET'} ${url} ${this.testmode ? styleMessage(color.debug, '(test)') : ''}`;
    const spinner = ora(statusLog).start();

    const response = await fetch(input, {
      ...this.baseInit,
      ...init,
      headers: {
        Accept: 'application/json',
        ...this.baseInit?.headers,
        ...init?.headers,
      },
    });
    let { status }: { status: Response['status'] | string } = response;
    const responseTime = Date.now() - startTime;

    if (status >= 200 && status < 300) status = styleMessage(color.success, status);
    else if (status >= 300 && status < 400) status = styleMessage(color.warn, status);
    else status = styleMessage(color.error, status);

    const responseLog = `  ${statusLog} ${status} ${responseTime}ms`;

    spinner.stop();

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      print.info(responseLog);

      let errorMessage = '';
      if (contentType?.includes('application/json')) errorMessage = await response.json();
      else errorMessage = await response.text();

      print.warn(errorMessage);

      exitWithError('Failed to fetch');
    }

    print.info(responseLog);

    if (contentType?.includes('application/json')) return response.json() as Promise<T>;
    return response.text() as Promise<T>;
  }

  get<T>(url: string | URL, init?: RequestInit) {
    return this.request<T>(url, { method: 'GET', ...init });
  }

  post<T>(url: string | URL, body?: unknown, init?: RequestInit) {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    });
  }

  put<T>(url: string | URL, body?: unknown, init?: RequestInit) {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    });
  }

  delete<T>(url: string | URL, init?: RequestInit) {
    return this.request<T>(url, { method: 'DELETE', ...init });
  }
}
