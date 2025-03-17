import { Client } from 'ssh2';
import { jsonLog, print } from './log.ts';
import { env, zealTestsystemUrl } from '../config.ts';
import { readFileSync } from 'fs';

export const streamSSHCommand = async (
  command: string,
  {
    testsystem,
    parseJson,
    timestamp,
  }: {
    testsystem?: string;
    parseJson?: boolean;
    timestamp?: boolean;
  } = {}
) => {
  const conn = new Client();
  conn
    .on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) throw err;
        stream
          .on('close', (code: number, signal: unknown) => {
            conn.end();
            print.info('Closing stream with code ' + code + ', signal: ' + signal);
            return { code, signal };
          })
          .on('data', (data: Buffer) => {
            jsonLog(data, parseJson, timestamp);
          })
          .stderr.on('data', (data: Buffer) => {
            jsonLog(data, parseJson, timestamp);
          });
      });
    })
    .connect({
      host: zealTestsystemUrl(testsystem || env.TESTSYSTEM_HOST),
      port: 22,
      username: env.USER,
      privateKey: readFileSync(env.SSH_KEY),
    });
};
