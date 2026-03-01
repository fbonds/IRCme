require('dotenv').config({ override: false });
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
      content: `*${action}*`,
      username: displayName,
      avatarURL: avatarURL,
    });
  } catch (error) {
    console.error('Error executing /emote:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
