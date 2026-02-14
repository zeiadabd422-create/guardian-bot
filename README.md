# Guardian Bot

A production-grade modular Discord bot infrastructure built with Node.js (ES Modules) and discord.js v14.

## Features

- ✅ **ES Modules** - Modern JavaScript module system
- ✅ **Modular Architecture** - Clean separation of concerns
- ✅ **Command Loader** - Folder-based command system
- ✅ **Event System** - Dynamic event registration
- ✅ **Module System** - Extensible feature modules
- ✅ **Winston Logger** - Comprehensive logging system
- ✅ **Database Support** - Ready for MongoDB integration
- ✅ **Cache Support** - Ready for Redis integration
- ✅ **Production Ready** - Scalable and maintainable

## Directory Structure

```
guardian-bot/
├── src/
│   ├── index.js                 # Main entry point / orchestrator
│   ├── config/
│   │   └── config.js            # Configuration management
│   ├── loaders/
│   │   ├── logger.js            # Winston logger setup
│   │   ├── database.js          # Database placeholder (MongoDB)
│   │   ├── cache.js             # Cache placeholder (Redis)
│   │   ├── commands.js          # Command loader
│   │   ├── events.js            # Event loader
│   │   └── modules.js           # Module loader
│   ├── commands/                # Bot commands (folder-based)
│   │   └── index.js             # Command structure template
│   ├── events/                  # Bot events (folder-based)
│   │   └── index.js             # Event structure template
│   ├── modules/                 # Feature modules (folder-based)
│   │   └── index.js             # Module structure template
│   └── utils/
│       └── helpers.js           # Utility functions
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

1. **Clone or download the repository**

```bash
cd guardian-bot
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment configuration**

```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`:

```env
# Required
DISCORD_TOKEN=your_discord_bot_token_here

# Optional
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URI=mongodb://localhost:27017/guardian-bot
REDIS_URI=redis://localhost:6379
```

## Usage

### Starting the bot

```bash
npm start
```

### Development mode (with auto-reload)

```bash
npm run dev
```

## Project Setup

### Creating a Command

Commands use a folder-based structure. Each command lives in its own folder:

1. Create a folder in `src/commands/`:

```
src/commands/mycommand/
```

2. Create `index.js` inside the folder:

```javascript
export default {
  data: {
    name: 'mycommand',
    description: 'My command description'
  },
  execute: async (interaction) => {
    await interaction.reply('Command executed!');
  }
};
```

### Creating an Event

Events also use a folder-based structure:

1. Create a folder in `src/events/`:

```
src/events/myevent/
```

2. Create `index.js` inside the folder:

```javascript
export default {
  name: 'ready',
  once: true,
  execute: (client) => {
    console.log(`Bot logged in as ${client.user.tag}`);
  }
};
```

### Creating a Module

Modules are reusable feature systems. They can initialize complex services:

1. Create a folder in `src/modules/`:

```
src/modules/mymodule/
```

2. Create `index.js` inside the folder:

```javascript
export default {
  name: 'mymodule',
  initialize: async (client) => {
    // Initialize module functionality
    console.log('Module initialized');
  }
};
```

## Services Access

All services are attached to the client object for easy access:

```javascript
// In commands, events, and modules:
export default {
  execute: async (interaction) => {
    const { client } = interaction;

    // Access logger
    client.logger.info('Message');

    // Access database
    await client.database.connect();

    // Access cache
    await client.cache.get('key');
  }
};
```

## Configuration

### Environment Variables

- **DISCORD_TOKEN** - Your Discord bot token (required)
- **NODE_ENV** - Environment (development/production)
- **LOG_LEVEL** - Logging level (error, warn, info, http, debug)
- **DATABASE_URI** - MongoDB connection string (optional)
- **REDIS_URI** - Redis connection string (optional)

### Database Integration (MongoDB)

Replace the placeholder in `src/loaders/database.js`:

```javascript
import mongoose from 'mongoose';

// In connect() method:
await mongoose.connect(config.database.uri);
```

### Cache Integration (Redis)

Replace the placeholder in `src/loaders/cache.js`:

```javascript
import { createClient } from 'redis';

// In connect() method:
this.client = createClient({ url: config.cache.uri });
await this.client.connect();
```

## Startup Sequence

The bot initializes in the following order:

1. **Logger** - Initialize Winston logger
2. **Database** - Connect to database (if configured)
3. **Cache** - Connect to cache (if configured)
4. **Commands** - Load all commands from folders
5. **Events** - Load all events from folders
6. **Modules** - Load and initialize all modules
7. **Discord Client** - Login to Discord

## Logging

The bot uses Winston for comprehensive logging:

- **Logs directory**: `logs/`
  - `error.log` - Error-level logs
  - `all.log` - All logs
  - Console output during development

Log levels: `error`, `warn`, `info`, `http`, `debug`

## Production Deployment

1. Set `NODE_ENV=production` in your `.env`
2. Ensure all required environment variables are set
3. Use a process manager (PM2, systemd, etc.)
4. Configure database and cache for production
5. Monitor logs in the `logs/` directory

### Example PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'guardian-bot',
      script: './src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

## Core Loaders

- **Logger Loader** - Initializes Winston logger with file and console transports
- **Database Loader** - Manages database connections (MongoDB-ready)
- **Cache Loader** - Manages cache connections (Redis-ready)
- **Command Loader** - Dynamically loads all commands from folder structure
- **Event Loader** - Dynamically loads all Discord events from folder structure
- **Module Loader** - Dynamically loads and initializes feature modules

## Best Practices

1. **Use proper error handling** - Try-catch blocks in loaders and handlers
2. **Log important events** - Use the logger for tracking bot activity
3. **Keep commands small** - Use modules for complex functionality
4. **Use environment variables** - Never hardcode secrets
5. **Follow the folder structure** - Maintain consistency across the codebase
6. **Document your code** - Add comments to clarify complex logic

## Extending the Framework

### Adding Custom Loaders

Create a new loader in `src/loaders/` and integrate it into `src/index.js`:

```javascript
// src/loaders/myloader.js
export default class MyLoader {
  async load() {
    // Your loading logic
  }
}
```

### Adding Middleware

Commands and events can implement middleware patterns for shared logic.

## Troubleshooting

### Bot doesn't start

- Check if `DISCORD_TOKEN` is set in `.env`
- Verify Node.js version >= 18.0.0
- Check log files in `logs/` directory

### Commands not loading

- Verify command folders exist in `src/commands/`
- Check each command has `data` and `execute` properties
- Review logs for loading errors

### Events not firing

- Verify event folders exist in `src/events/`
- Check event name matches Discord.js event names
- Ensure intents are properly configured

## Support & Contributing

For issues, questions, or contributions, please refer to the project repository.

## License

MIT