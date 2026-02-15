/**
 * Configuration schema for the Introduce module
 * Defines the structure for guild-based introduce settings
 */
export const introduceConfigSchema = {
  // Whether the introduce module is enabled for this guild
  enabled: {
    type: 'boolean',
    default: false,
    description: 'Enable/disable the introduce module for this guild'
  },

  // Channel ID where introductions are sent
  channelId: {
    type: 'string',
    default: null,
    description: 'Discord channel ID for introduction messages'
  },

  // Embed configuration
  embed: {
    title: {
      type: 'string',
      default: '👋 New Introduction!',
      description: 'Title of the introduction embed'
    },
    description: {
      type: 'string',
      default: 'Welcome {user}! Please introduce yourself to the community.',
      description: 'Description template for the introduction embed (supports {user} placeholder)'
    },
    color: {
      type: 'number',
      default: 0x00ff00,
      description: 'Hex color code for the embed (as decimal number)'
    }
  },

  // Whether to require introduction before allowing other actions
  required: {
    type: 'boolean',
    default: false,
    description: 'Require users to introduce themselves before participating'
  },

  // Custom welcome message sent to user after introduction
  welcomeMessage: {
    type: 'string',
    default: 'Thank you for introducing yourself! Welcome to the server.',
    description: 'Private message sent to user after successful introduction'
  }
};

export default introduceConfigSchema;