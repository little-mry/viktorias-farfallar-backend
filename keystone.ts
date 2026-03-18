import 'dotenv/config';
import { config } from '@keystone-6/core';
import { lists } from './schema.js';

export default config({
  db: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || '',
  },
  lists,
  ui: {
    isAccessAllowed: () => true,
  },
  server: {
    port: 3001,
  },
});