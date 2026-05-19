import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createJsonFileRoute } from './jsonFileRoute.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createJsonFileRoute(join(__dirname, '../data/televize.json'));
