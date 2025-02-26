import { fetcher } from './utils/fetcher.ts';
import { log } from './utils/log.ts';

fetcher('https://jsonplaceholder.typicode.com/todos/1').then((res) => log(res));
