const credentials = `${process.env.JENKINS_USER}:${process.env.JENKINS_TOKEN}`;

export const config = {
  testsystem: `${process.env.TESTSYSTEM_HOST}.test.t24.eu-west-1.sg-cloud.co.uk`,
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
