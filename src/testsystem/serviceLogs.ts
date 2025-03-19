import prompts from 'prompts';
import { exitWithError } from '../utils/error.ts';
import { type LogLevel } from '../utils/log.ts';
import { executeSSH } from '../utils/ssh.ts';

export const serviceLogs = async ({
  testsystem,
  service,
  namespace,
  parse,
  timestamp,
  list,
  filter,
}: {
  testsystem: string;
  service: string;
  namespace: string;
  parse?: boolean;
  timestamp?: boolean;
  list?: boolean;
  filter?: LogLevel;
}) => {
  let listSelection: { name: string; namespace: string } | null = null;
  if (list) {
    const servicesCommand = `kubectl get svc --all-namespaces --no-headers -o custom-columns=NAME:.metadata.name,NAMESPACE:.metadata.namespace`;
    const services = await executeSSH(servicesCommand, { testsystem });
    if (services.code !== 0 || !services.stdout) exitWithError(services.stderr);
    const serviceList = services.stdout.split('\n').map((line) => {
      const splitLine = line.split(' ');
      const [serviceName] = splitLine;
      const serviceNamespace = splitLine.pop();
      return { title: serviceName, value: { name: serviceName, namespace: serviceNamespace } };
    });

    if (serviceList.length === 0) exitWithError('No services found');

    const { k8sService } = await prompts({
      type: 'select',
      name: 'k8sService',
      message: 'Pick a service',
      choices: serviceList,
    });

    if (!k8sService) exitWithError('No service selected');

    listSelection = k8sService;
  }

  const cmdNamespace = listSelection?.namespace || namespace;
  const cmdService = listSelection?.name || service;

  const logCommand = `kubectl logs -n ${cmdNamespace} -f $(kubectl get pods -n ${cmdNamespace} -l app=${cmdService} -o jsonpath="{.items[0].metadata.name}")`;

  // filter

  return executeSSH(logCommand, {
    testsystem,
    streamLogs: {
      enable: true,
      parseJson: parse,
      timestamp,
      filter,
    },
  });
};
