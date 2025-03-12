import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const basePath = dirname(fileURLToPath(import.meta.url)).slice(0, -4);

export const path = {
  root: basePath,
  env: basePath + '/.env',
  tmp: basePath + '/.tmp',
};

const { parsed } = dotenv.config({ path: path.env });

export const env = {
  JENKINS_USER: parsed?.JENKINS_USER,
  JENKINS_TOKEN: parsed?.JENKINS_TOKEN,
  TESTSYSTEM_HOST: parsed?.TESTSYSTEM_HOST,
  TESTSYSTEM: `${parsed?.TESTSYSTEM_HOST}`,
};

const credentials = `${env.JENKINS_USER}:${env.JENKINS_TOKEN}`;

export const config = {
  jenkins: {
    url: 'https://platform-jenkins.test.h.zeal.zone',
    authorization: 'Basic ' + Buffer.from(credentials).toString('base64'),
    jobs: {
      deployDhrFrontend: '/job/DEPLOY_TEST_AWS__DHR_FRONTEND/buildWithParameters',
      prolong: '/job/PLATFORM_AWS_PROLONG_TEST_SYSTEM/buildWithParameters',
      start: '/job/PLATFORM_AWS_TESTSYSTEM_CREATE_AND_DEPLOY/buildWithParameters',
      destroy: '/job/PLATFORM_AWS_TESTSYSTEM_DELETE/buildWithParameters',
    },
  },
};

export const jenkinsJobApi = (job: keyof typeof config.jenkins.jobs) => job + '/api/json';
export const zealTestsystemUrl = (testsystem = env.TESTSYSTEM_HOST) =>
  `${testsystem}.test.t24.eu-west-1.sg-cloud.co.uk`;
