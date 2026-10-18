import getReporter from './utils/getReporter';

async function globalSetup() {
  const mcr = await getReporter();
  mcr.cleanCache();
}

export default globalSetup;
