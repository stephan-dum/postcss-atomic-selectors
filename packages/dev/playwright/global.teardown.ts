import getReporter from './utils/getReporter';

async function globalTeardown() {
  const mcr = await getReporter();
  await mcr.generate();
}

export default globalTeardown;
