/**
 * Events Directory - Folder-based Structure
 * 
 * Add new events by creating a folder with an index.js file
 * 
 * Example structure:
 * events/
 *   ├── ready/
 *   │   └── index.js (export event with name and execute)
 *   └── messageCreate/
 *       └── index.js (export event with name and execute)
 * 
 * Example event format (ES Module):
 * export default {
 *   name: 'ready',
 *   once: true,
 *   execute: (client) => {
 *     console.log(`${client.user.tag} is online`);
 *   }
 * };
 */
