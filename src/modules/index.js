/**
 * Modules Directory - Folder-based Structure
 * 
 * Add new modules by creating a folder with an index.js file
 * Modules can initialize complex features or services
 * 
 * Example structure:
 * modules/
 *   ├── antiSpam/
 *   │   └── index.js (export module with name and optional initialize)
 *   └── welcome/
 *       └── index.js (export module with name and optional initialize)
 * 
 * Example module format (ES Module):
 * export default {
 *   name: 'antiSpam',
 *   initialize: async (client) => {
 *     console.log('Anti-spam module initialized');
 *   }
 * };
 */
