import { allPrs } from './utils/gh.ts';
import { log } from './utils/log.ts';

const args = process.argv.slice(2);

try {
  log.info(args);
  allPrs().then(log.info);
} catch (e) {
  log.error(e);
}
