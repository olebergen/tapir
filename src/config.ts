import os from 'os';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { exitWithError } from './utils/error.ts';
import { fileExists } from './utils/file.ts';

export const basePath = dirname(fileURLToPath(import.meta.url)).slice(0, -4); // slice away /bin

const findProjectPath = async (project: string) => {
  const inHomePath = join(os.homedir(), project);
  const existsInHome = await fileExists(inHomePath);
  if (existsInHome) return inHomePath;

  const inDirAbovePath = join(basePath, '..', project);
  const existsInDirAbove = await fileExists(inDirAbovePath);
  if (existsInDirAbove) return inDirAbovePath;

  // todo weg wenns kein monorepo mehr ist
  const inMonorepoAbovePath = join(basePath, '..', 'reactor', 'apps', project);
  const existsInMonorepoAbove = await fileExists(inMonorepoAbovePath);
  if (existsInMonorepoAbove) return inMonorepoAbovePath;

  return null;
};

export const path = {
  root: basePath,
  env: join(basePath, '.env'),
  tmp: join(basePath, '.tmp'),
  dhr: await findProjectPath('dream-house-raffle'),
  fplus: await findProjectPath('freiheitplus'),
} as const;

const { parsed } = dotenv.config({ path: path.env });

export const env = {
  USER: os.userInfo().username,
  JENKINS_USER: process.env.JENKINS_USER || parsed!.JENKINS_USER,
  JENKINS_TOKEN: process.env.JENKINS_TOKEN || parsed!.JENKINS_TOKEN,
  TESTSYSTEM_HOST: process.env.TESTSYSTEM_HOST || parsed!.TESTSYSTEM_HOST,
  SSH_AUTH_SOCK: process.env.SSH_AUTH_SOCK || parsed!.SSH_AUTH_SOCK,
  TEST: parsed?.TEST || process.env.TEST,
} as const;

const optionalEnv = ['TEST'];

for (const [key, value] of Object.entries(env)) {
  if (optionalEnv.includes(key)) continue;
  if (!value) exitWithError(`Missing environment variable: ${key}`);
}

export const isTestmode = (flag?: boolean) => env.TEST === '1' || env.TEST === 'true' || flag;

const jenkinsCredentials = `${env.JENKINS_USER}:${env.JENKINS_TOKEN}`;

export const config = {
  jenkins: {
    url: 'https://platform-jenkins.test.h.zeal.zone',
    authorization: 'Basic ' + Buffer.from(jenkinsCredentials).toString('base64'),
    jobs: {
      deployDhrFrontend: '/job/DEPLOY_TEST_AWS__DHR_FRONTEND',
      prolong: '/job/PLATFORM_AWS_PROLONG_TEST_SYSTEM',
      start: '/job/PLATFORM_AWS_TESTSYSTEM_CREATE_AND_DEPLOY',
      destroy: '/job/PLATFORM_AWS_TESTSYSTEM_DELETE',
    },
    buildWithParameters: '/buildWithParameters',
    builds: '/api/json?tree=builds[url,result,timestamp]', // duration, number
  },
} as const;

export const jenkinsJobApi = (job: keyof typeof config.jenkins.jobs) => job + '/api/json';
export const zealTestsystemUrl = (testsystem = env.TESTSYSTEM_HOST) =>
  `${testsystem}.test.t24.eu-west-1.sg-cloud.co.uk`;
