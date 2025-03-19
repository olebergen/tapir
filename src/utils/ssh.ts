import { Client } from 'ssh2';
import { env, zealTestsystemUrl } from '../config.ts';
import { type LogLevel, print } from './log.ts';
import { styleMessage } from './color.ts';
import { type ExecuteResult, type Output, returnOutput } from './execute.ts';

export type ExecuteSSHOptions = {
  testsystem?: string;
  streamLogs?: {
    enable?: boolean;
    parseJson?: boolean;
    timestamp?: boolean;
    filter?: LogLevel;
  };
};

export const parseLogs = (data: Buffer, streamLogs: ExecuteSSHOptions['streamLogs']) => {
  // can contain multiple json objects
  const logs = data
    .toString()
    .split('\n')
    .filter((line) => line.trim() !== '');

  // node DateTimeFormat doesn't have fractionalSecondDigits, that's why this is so dumb
  const now = new Date();
  const time = `${new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    // fractionalSecondDigits: 'numeric',
  }).format(new Date())}:${now.getMilliseconds()}`;
  const ts = streamLogs?.timestamp ? styleMessage('debug', time) : undefined;

  if (streamLogs?.parseJson || streamLogs?.filter) {
    logs.forEach((log) => {
      try {
        const parsed = JSON.parse(log);
        if (streamLogs?.filter && streamLogs.filter !== parsed.level) return;
        print.info(parsed);
        if (ts) print.info(`at ${ts}\n`);
      } catch {
        print.info(ts ? `${ts} -- ${log}` : log);
      }
    });
  } else logs.forEach((log) => print.info(streamLogs?.timestamp ? `${ts} -- ${log}` : log));
};

export const executeSSH = async (
  command: string,
  { testsystem, streamLogs }: ExecuteSSHOptions = {}
): Promise<ExecuteResult> => {
  return new Promise((resolve, reject) => {
    const printAsLog = streamLogs ? Object.entries(streamLogs).some(([, value]) => value) : false;

    const conn = new Client();

    const buffers: Output = { stdout: [], stderr: [] };

    conn
      .on('ready', () => {
        conn.exec(command, (err, stream) => {
          if (err) reject(err);
          stream
            .on('close', (code: number) => {
              conn.end();
              resolve(returnOutput(buffers, code));
            })
            .on('data', (data: Buffer) => {
              if (printAsLog) parseLogs(data, streamLogs);
              else buffers.stdout.push(data);
            })
            .stderr.on('data', (data: Buffer) => {
              if (printAsLog) parseLogs(data, streamLogs);
              else buffers.stdout.push(data);
            });
        });
      })
      .connect({
        host: zealTestsystemUrl(testsystem || env.TESTSYSTEM_HOST),
        port: 22,
        username: env.USER,
        agent: env.SSH_AUTH_SOCK,
      });
  });
};
