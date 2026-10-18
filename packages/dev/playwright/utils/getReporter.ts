import path from 'node:path';
import type { CoverageReport } from 'monocart-coverage-reports';

const getReporter = async () =>
  (
    (await import(path.join(process.cwd(), 'mcr.config.js'))) as {
      default: CoverageReport;
    }
  ).default;

export default getReporter;
