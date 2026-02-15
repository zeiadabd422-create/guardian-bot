import { EmbedBuilder } from 'discord.js';

/**
 * Introduce Module - Actions
 * Handles sending introduction embeds and welcome messages
 */

class IntroduceActions {
  constructor(client) {
    this.client = client;
  }

  /**
   * Send an introduction embed to the configured channel
   * @param {string} guildId - Discord guild ID
   * @param {string} channelId - Discord channel ID
   * @param {Object} user - Discord user object
   * @param {string} messageContent - The introduction message content
   * @returns {Promise<void>}
   */
  async sendIntroductionEmbed(guildId, channelId, user, messageContent) {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel) {
        throw new Error(`Channel ${channelId} not found`);
      }

      // TODO: Get embed config from database
      // const config = await this.client.database.getGuildConfig(guildId, 'introduce');

      // Temporary embed config
      const embedConfig = {
        title: '👋 New Introduction!',
        description: 'Welcome {user}! Please introduce yourself to the community.',
        color: 0x00ff00
      };

      const embed = new EmbedBuilder()
        .setTitle(embedConfig.title)
        .setDescription(embedConfig.description.replace('{user}', user.toString()))
        .setColor(embedConfig.color)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          { name: 'Member', value: user.toString(), inline: true },
          { name: 'Joined', value: `<t:${Math.floor(user.joinedAt?.getTime() / 1000) || Math.floor(Date.now() / 1000)}:F>`, inline: true }
        )
        .setTimestamp();

      // Add the user's message as a field if it's not too long
      if (messageContent && messageContent.length <= 1024) {
        embed.addFields({ name: 'Introduction', value: messageContent, inline: false });
      }

      await channel.send({ embeds: [embed] });

      this.client.logger.debug(`Sent introduction embed for user ${user.id} in guild ${guildId}`);
    } catch (error) {
      this.client.logger.error(`Error sending introduction embed for user ${user.id} in guild ${guildId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send a welcome message to the user
   * @param {Object} user - Discord user object
   * @param {string} welcomeMessage - The welcome message content
   * @returns {Promise<void>}
   */
  async sendWelcomeMessage(user, welcomeMessage = 'Thank you for introducing yourself! Welcome to the server.') {
    try {
      await user.send(welcomeMessage);
      this.client.logger.debug(`Sent welcome message to user ${user.id}`);
    } catch (error) {
      // Ignore errors if user has DMs disabled
      if (error.code === 50007) {
        this.client.logger.debug(`Could not send welcome message to user ${user.id} (DMs disabled)`);
      } else {
        this.client.logger.error(`Error sending welcome message to user ${user.id}: ${error.message}`);
      }
    }
  }

  /**
   * Process a new introduction
   * @param {string} guildId - Discord guild ID
   * @param {Object} message - Discord message object
   * @returns {Promise<void>}
   */
  async processIntroduction(guildId, message) {
    try {
      const { author, channel, content } = message;

      // Get channel ID from config
      // TODO: Get from database
      const channelId = null; // Temporary

      if (channelId && channel.id === channelId) {
        // Send the embed
        await this.sendIntroductionEmbed(guildId, channelId, author, content);

        // Send welcome message
        // TODO: Get welcome message from database
        const welcomeMessage = 'Thank you for introducing yourself! Welcome to the server.';
        await this.sendWelcomeMessage(author, welcomeMessage);

        // Mark user as introduced
        // This will be handled by the checker
      }
    } catch (error) {
      this.client.logger.error(`Error processing introduction for user ${message.author.id} in guild ${guildId}: ${error.message}`);
      throw error;
    }
  }
}

export default IntroduceActions;