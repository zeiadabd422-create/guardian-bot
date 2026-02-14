import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CommandLoader {
  constructor(client) {
      this.client = client;
          this.commands = new Map();
            }

              /**
                 * Load all commands from the commands directory
                    * Each command should be in its own folder with an index.js file
                       * @returns {Promise<void>}
                          */
                            async load() {
                                try {
                                      const commandsDir = join(__dirname, '../commands');
                                            const categories = await readdir(commandsDir, { withFileTypes: true });

                                                  let loadedCount = 0;

                                                        for (const category of categories) {
                                                                if (!category.isDirectory()) continue;

                                                                        const categoryPath = join(commandsDir, category.name);
                                                                                const indexPath = join(categoryPath, 'index.js');

                                                                                        try {
                                                                                                  const commandUrl = pathToFileURL(indexPath).href;
                                                                                                            const { default: command } = await import(commandUrl);

                                                                                                                      if (!command || !command.data || !command.execute) {
                                                                                                                                  logger.warn(
                                                                                                                                                `Command in ${category.name}/index.js is missing required properties (data, execute)`
                                                                                                                                                            );
                                                                                                                                                                        continue;
                                                                                                                                                                                  }

                                                                                                                                                                                            this.commands.set(command.data.name, command);
                                                                                                                                                                                                      this.client.commands.set(command.data.name, command);
                                                                                                                                                                                                                loadedCount++;
                                                                                                                                                                                                                          logger.debug(`Loaded command: ${command.data.name}`);
                                                                                                                                                                                                                                  } catch (error) {
                                                                                                                                                                                                                                            logger.error(
                                                                                                                                                                                                                                                        `Failed to load command from ${category.name}/index.js: ${error.message}`
                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                      logger.info(`Successfully loaded ${loadedCount} commands`);
                                                                                                                                                                                                                                                                                          } catch (error) {
                                                                                                                                                                                                                                                                                                logger.error(`Command loader failed: ${error.message}`);
                                                                                                                                                                                                                                                                                                      throw error;
                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                              /**
                                                                                                                                                                                                                                                                                                                 * Get a specific command
                                                                                                                                                                                                                                                                                                                    * @param {string} name - Command name
                                                                                                                                                                                                                                                                                                                       * @returns {Object|null}
                                                                                                                                                                                                                                                                                                                          */
                                                                                                                                                                                                                                                                                                                            getCommand(name) {
                                                                                                                                                                                                                                                                                                                                return this.commands.get(name) || null;
                                                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                                                    /**
                                                                                                                                                                                                                                                                                                                                       * Get all loaded commands
                                                                                                                                                                                                                                                                                                                                          * @returns {Map}
                                                                                                                                                                                                                                                                                                                                             */
                                                                                                                                                                                                                                                                                                                                               getAll() {
                                                                                                                                                                                                                                                                                                                                                   return this.commands;
                                                                                                                                                                                                                                                                                                                                                     }
                                                                                                                                                                                                                                                                                                                                                     }

                                                                                                                                                                                                                                                                                                                                                     export default CommandLoader;