/**
 * Introduce Module
 * Handles user introductions in Discord guilds
 */

import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import IntroduceChecker from './checker.js';
import IntroduceActions from './actions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class IntroduceModule {
  constructor(client) {
    this.client = client;
    this.name = 'introduce';
    this.checker = new IntroduceChecker(client);
    this.actions = new IntroduceActions(client);
    this.handlers = new Map();
  }

  /**
   * Initialize the introduce module
   * @param {Object} client - Discord client
   * @param {Object} services - Services object (database, cache, etc.)
   * @returns {Promise<void>}
   */
  async initialize(client, services = {}) {
    try {
      this.client.logger.info('Initializing Introduce module...');

      // Attach services
      this.services = services;

      // Load and register handlers
      await this.loadHandlers();

      // Register the module services on client for access by handlers
      if (!client.modules) {
        client.modules = new Map();
      }
      client.modules.set(this.name, {
        checker: this.checker,
        actions: this.actions
      });

      this.client.logger.info('Introduce module initialized successfully');
    } catch (error) {
      this.client.logger.error(`Failed to initialize Introduce module: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load and register event handlers
   * @returns {Promise<void>}
   */
  async loadHandlers() {
    try {
      const handlersDir = join(__dirname, 'handlers');
      const handlerFiles = await readdir(handlersDir);

      for (const file of handlerFiles) {
        if (!file.endsWith('.js')) continue;

        const handlerPath = join(handlersDir, file);
        const { default: handler } = await import(`file://${handlerPath}`);

        if (!handler || !handler.name || !handler.execute) {
          this.client.logger.warn(`Handler ${file} is missing required properties`);
          continue;
        }

        // Initialize handler if it has an initialize method
        if (handler.initialize && typeof handler.initialize === 'function') {
          handler.initialize(this.client);
        }

        // Register the event handler
        this.client.on(handler.name, (...args) => handler.execute(...args));
        this.handlers.set(handler.name, handler);

        this.client.logger.debug(`Registered introduce handler: ${handler.name}`);
      }
    } catch (error) {
      this.client.logger.error(`Error loading introduce handlers: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the checker instance
   * @returns {IntroduceChecker}
   */
  getChecker() {
    return this.checker;
  }

  /**
   * Get the actions instance
   * @returns {IntroduceActions}
   */
  getActions() {
    return this.actions;
  }
}

// Create and export the module instance
const introduceModule = new IntroduceModule();

export default {
  name: introduceModule.name,
  initialize: introduceModule.initialize.bind(introduceModule)
};