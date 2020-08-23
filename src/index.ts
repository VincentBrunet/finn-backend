#!/usr/bin/env node
import { argv } from 'yargs';

import { HttpCache } from './services/utils/HttpCache';

import { AppReader } from './AppReader';
import { AppWriter } from './AppWriter';

console.log('Argv', argv);

const main = async () => {
  // Utils
  await HttpCache.prepare();
  // Writer enabled
  if (argv.app === 'writer' || argv.app === 'all') {
    const app = new AppWriter();
    app.listen(3002, () => {
      console.log('app:writer start');
    });
  }
  // Reader enabled
  if (argv.app === 'reader' || argv.app === 'all') {
    const app = new AppReader();
    app.listen(3001, () => {
      console.log('app:reader start');
    });
  }
};

main();
