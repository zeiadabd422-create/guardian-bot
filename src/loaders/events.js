import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

class EventLoader {
  constructor(client) {
    this.client = client;
    this.events = [];
  }

  /**
   * Load all events from the events directory
   * Each event should be in its own folder with an index.js file
   * @returns {Promise<void>}
   */
  async load() {
    try {
      const eventsDir = join(__dirname, '../events');
      const eventFolders = await readdir(eventsDir, { withFileTypes: true });

      let loadedCount = 0;

      for (const folder of eventFolders) {
        if (!folder.isDirectory()) continue;

        const eventPath = join(eventsDir, folder.name);
        const indexPath = join(eventPath, 'index.js');

        try {
          const { default: event } = await import(`file://${indexPath}`);

          if (!event || !event.name || !event.execute) {
            logger.warn(
              `Event in ${folder.name}/index.js is missing required properties (name, execute)`
            );
            continue;
          }

          if (event.once) {
            this.client.once(event.name, (...args) => event.execute(...args));
            logger.debug(`Loaded once event: ${event.name}`);
          } else {
            this.client.on(event.name, (...args) => event.execute(...args));
            logger.debug(`Loaded on event: ${event.name}`);
          }

          this.events.push(event.name);
          loadedCount++;
        } catch (error) {
          logger.error(
            `Failed to load event from ${folder.name}/index.js: ${error.message}`
          );
        }
      }

      logger.info(`Successfully loaded ${loadedCount} events`);
    } catch (error) {
      logger.error(`Event loader failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all loaded events
   * @returns {Array}
   */
  getAll() {
    return this.events;
  }
}

export const EventLoader = EventLoader;
export default EventLoader;
