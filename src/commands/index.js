/**
 * Commands Directory - Folder-based Structure
 * 
 * Add new commands by creating a folder with an index.js file
 * 
 * Example structure:
 * commands/
 *   ├── ping/
 *   │   └── index.js (export command with data and execute)
 *   └── help/
 *       └── index.js (export command with data and execute)
 * 
 * Example command format (ES Module):
 * export default {
 *   data: {
 *     name: 'ping',
 *     description: 'Responds with pong'
 *   },
 *   execute: async (interaction) => {
 *     await interaction.reply('Pong!');
 *   }
 * };
 */
