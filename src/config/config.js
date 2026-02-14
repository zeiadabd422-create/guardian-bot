import 'dotenv/config.js';

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    intents: [
      'Guilds',
      'GuildMembers',
      'GuildMessages',
      'MessageContent',
      'DirectMessages'
    ]
  },
  database: {
    uri: process.env.DATABASE_URI || null,
    enabled: !!process.env.DATABASE_URI
  },
  cache: {
    enabled: !!process.env.REDIS_URI,
    uri: process.env.REDIS_URI || null
  },
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info'
};

export default config;
