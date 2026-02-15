/**
 * Introduce Module - Message Create Handler
 * Handles messageCreate events for the introduce module
 */

import IntroduceChecker from '../checker.js';
import IntroduceActions from '../actions.js';

let checker;
let actions;

/**
 * Initialize the handler with required services
 * @param {Object} client - Discord client
 */
function initializeHandler(client) {
  checker = new IntroduceChecker(client);
  actions = new IntroduceActions(client);
}

/**
 * Handle messageCreate events
 * @param {Object} message - Discord message object
 */
async function handleMessageCreate(message) {
  try {
    // Ignore bot messages and DMs
    if (message.author.bot || !message.guild) {
      return;
    }

    const { guild, author } = message;
    const guildId = guild.id;
    const userId = author.id;

    // Check if introduce is enabled for this guild
    const isEnabled = await checker.isEnabled(guildId);
    if (!isEnabled) {
      return;
    }

    // Check if user has already introduced
    const hasIntroduced = await checker.hasIntroduced(guildId, userId);
    if (hasIntroduced) {
      return;
    }

    // Get the introduction channel
    const channelId = await checker.getChannelId(guildId);
    if (!channelId || message.channel.id !== channelId) {
      return;
    }

    // Process the introduction
    await actions.processIntroduction(guildId, message);

    // Mark user as introduced
    await checker.markIntroduced(guildId, userId);

  } catch (error) {
    message.client.logger.error(`Error in introduce messageCreate handler: ${error.message}`);
  }
}

export default {
  name: 'messageCreate',
  execute: handleMessageCreate,
  initialize: initializeHandler
};