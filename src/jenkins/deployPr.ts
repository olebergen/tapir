const deploy_dhr_frontend_job =
  'https://platform-jenkins.test.h.zeal.zone/job/DEPLOY_TEST_AWS__DHR_FRONTEND/buildWithParameters';

const jenkins_url =
  '"' +
  deploy_dhr_frontend_job +
  '?TESTSYSTEM=' +
  testsystem_url +
  '&DHR_FRONTEND_VERSION=' +
  pr_tag +
  '"';

const auth = '-u ole-bergen:' + token;

// exexute
