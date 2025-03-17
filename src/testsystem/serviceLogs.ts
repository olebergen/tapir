import { streamSSHCommand } from '../utils/ssh.ts';

export const serviceLogs = async ({
  testsystem,
  service,
  namespace,
  parse,
  timestamp,
}: {
  testsystem: string;
  service: string;
  namespace: string;
  parse?: boolean;
  timestamp?: boolean;
}) => {
  const logCommand = `kubectl logs -n ${namespace} -f $(kubectl get pods -n ${namespace} -l app=${service} -o jsonpath="{.items[0].metadata.name}")`;
  return streamSSHCommand(logCommand, { testsystem, parseJson: parse, timestamp });
};
