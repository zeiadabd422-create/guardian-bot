import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

class ModuleLoader {
  constructor(client) {
    this.client = client;
    this.modules = new Map();
  }

  /**
   * Load all modules from the modules directory
   * Each module should be in its own folder with an index.js file
   * @returns {Promise<void>}
   */
  async load() {
    try {
      const modulesDir = join(__dirname, '../modules');
      const moduleFolders = await readdir(modulesDir, { withFileTypes: true });

      let loadedCount = 0;

      for (const folder of moduleFolders) {
        if (!folder.isDirectory()) continue;

        const modulePath = join(modulesDir, folder.name);
        const indexPath = join(modulePath, 'index.js');

        try {
          const { default: module } = await import(`file://${indexPath}`);

          if (!module || !module.name) {
            logger.warn(
              `Module in ${folder.name}/index.js is missing required properties (name)`
            );
            continue;
          }

          // If module has an initialize method, call it
          if (module.initialize && typeof module.initialize === 'function') {
            await module.initialize(this.client);
            logger.debug(`Initialized module: ${module.name}`);
          }

          this.modules.set(module.name, module);
          loadedCount++;
          logger.debug(`Loaded module: ${module.name}`);
        } catch (error) {
          logger.error(
            `Failed to load module from ${folder.name}/index.js: ${error.message}`
          );
        }
      }

      logger.info(`Successfully loaded ${loadedCount} modules`);
    } catch (error) {
      logger.error(`Module loader failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a specific module
   * @param {string} name - Module name
   * @returns {Object|null}
   */
  getModule(name) {
    return this.modules.get(name) || null;
  }

  /**
   * Get all loaded modules
   * @returns {Map}
   */
  getAll() {
    return this.modules;
  }
}

export const ModuleLoader = ModuleLoader;
export default ModuleLoader;
