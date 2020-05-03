import { HttpCache } from './services/utils/HttpCache';

import { App } from './app';

const main = async () => {
  await HttpCache.prepare();
  const app = new App();
  app.listen(3000, () => {
    console.log('go!');
  });
};

main();
