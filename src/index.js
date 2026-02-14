import { Client, GatewayIntentBits, Collection } from 'discord.js';
import logger from './loaders/logger.js';
import config from './config/config.js';
import database from './loaders/database.js';
import cache from './loaders/cache.js';
import CommandLoader from './loaders/commands.js';
import EventLoader from './loaders/events.js';
import ModuleLoader from './loaders/modules.js';

/**
 * Initialize and start the Discord bot
 */
async function main() {
  try {
    logger.info('Guardian Bot starting...');

    // Validate Discord token
    if (!config.discord.token) {
      throw new Error('DISCORD_TOKEN environment variable is not set');
    }

    // Initialize Discord client
    logger.info('Initializing Discord client...');
    const client = new Client({
      intents: config.discord.intents.map((intent) =>
        GatewayIntentBits[intent]
      )
    });

    // Initialize command collection
    client.commands = new Collection();

    // Connect to database
    logger.info('Connecting to database...');
    await database.connect();

    // Connect to cache
    logger.info('Connecting to cache...');
    await cache.connect();

    // Load commands
    logger.info('Loading commands...');
    const commandLoader = new CommandLoader(client);
    await commandLoader.load();

    // Load events
    logger.info('Loading events...');
    const eventLoader = new EventLoader(client);
    await eventLoader.load();

    // Load modules
    logger.info('Loading modules...');
    const moduleLoader = new ModuleLoader(client);
    await moduleLoader.load();

    // Attach loaders and services to client for access in handlers
    client.database = database;
    client.cache = cache;
    client.logger = logger;

    // Connect to Discord
    logger.info('Connecting to Discord...');
    await client.login(config.discord.token);

    logger.info('Guardian Bot is ready!');
  } catch (error) {
    logger.error(`Failed to start bot: ${error.message}`);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at ${promise}: ${reason}`);
});

// Start the bot
main();
