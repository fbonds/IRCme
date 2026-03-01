# IRCme Bot — Implementation Reference (v2 - Prefix Based)

## Overview
A Discord bot that replicates the classic `/me` emote command from IRC/MUD-style chat.
User types `/emote scratches his nose` as a regular message. The bot deletes the
original and reposts via webhook as:

> *Fletcher scratches his nose*

## Tech Stack
- **Language:** JavaScript (Node.js)
- **Library:** discord.js v14
- **Approach:** Message content listener (prefix-based, not slash commands)

## Required Discord Developer Portal Settings
- **Message Content Intent:** ENABLED (Bot page)
- **Bot Permissions:** Manage Webhooks, Send Messages, Read Message History, Manage Messages

## File Structure
```
ircme-bot/
├── index.js              # Main bot entry point (message listener)
├── cleanup-commands.js   # One-time script to remove old slash commands
├── deploy-commands.js    # (Legacy - no longer needed)
├── commands/
│   └── me.js             # (Legacy - no longer needed)
├── package.json
├── .env
├── .env.example
└── .gitignore
```

## .env
```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=1477563698561286237
```

## index.js
```javascript
require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Store webhook cache: channelId -> webhook
const webhookCache = new Collection();

client.once('ready', () => {
  console.log(`✅ IRCme is online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore bots
  if (message.author.bot) return;

  // Check if message starts with /emote
  if (!message.content.startsWith('/emote ')) return;

  const action = message.content.slice('/emote '.length).trim();
  if (!action) return;

  const member = message.member;
  const displayName = member?.displayName || message.author.displayName;
  const avatarURL =
    member?.displayAvatarURL({ size: 256 }) ||
    message.author.displayAvatarURL({ size: 256 });
  const channel = message.channel;

  try {
    // Delete the original message
    await message.delete();

    // Get or create a webhook for this channel
    let webhook = webhookCache.get(channel.id);

    if (!webhook) {
      const webhooks = await channel.fetchWebhooks();
      webhook = webhooks.find((wh) => wh.name === 'IRCme');

      if (!webhook) {
        webhook = await channel.createWebhook({ name: 'IRCme' });
      }

      webhookCache.set(channel.id, webhook);
    }

    // Send the emote message via webhook
    await webhook.send({
      content: `*${displayName} ${action}*`,
      username: displayName,
      avatarURL: avatarURL,
    });
  } catch (error) {
    console.error('Error executing /emote:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
```

## Setup & Run Steps

1. `npm install discord.js dotenv`
2. Create `.env` with your token and client ID
3. Enable **Message Content Intent** in Discord Developer Portal → Bot page
4. Clean up old slash commands: `node cleanup-commands.js`
5. Start the bot: `node index.js`
6. Add bot to a server using the OAuth2 invite URL
7. Test: type `/emote scratches his nose` as a regular message

## How It Works
1. User types `/emote <action>` as a normal message in any channel
2. Bot detects the message prefix, deletes the original message
3. Bot posts `*Username action*` via webhook using the user's display name and avatar
4. Result: an italic third-person emote that appears to come from the user

## OAuth2 Invite Permissions Needed
- `bot` scope
- Manage Webhooks
- Send Messages
- Read Message History
- Manage Messages (to delete the original message)

## Hosting (for 24/7 operation)
Bot must be running continuously. Options:
- Railway (free tier)
- Render (free tier)
- Fly.io (free tier)
- Home server / VPS
