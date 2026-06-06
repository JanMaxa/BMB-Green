import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJsonFileRoute } from './jsonFileRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default createJsonFileRoute(path.join(__dirname, '..', 'data', 'faq.json'));
