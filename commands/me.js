const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emote')
    .setDescription('Post an emote action in third person, IRC-style.')
    .addStringOption((option) =>
      option
        .setName('action')
        .setDescription('What are you doing? e.g. "scratches his nose"')
        .setRequired(true)
    ),

  async execute(interaction, webhookCache) {
    const action = interaction.options.getString('action');
    const member = interaction.member;
    const displayName = member?.displayName || interaction.user.displayName;
    const avatarURL =
      member?.displayAvatarURL({ size: 256 }) ||
      interaction.user.displayAvatarURL({ size: 256 });
    const channel = interaction.channel;

    try {
      // Get or create a webhook for this channel
      let webhook = webhookCache.get(channel.id);

      if (!webhook) {
        // Look for an existing IRCme webhook in the channel
        const webhooks = await channel.fetchWebhooks();
        webhook = webhooks.find((wh) => wh.name === 'IRCme');

        if (!webhook) {
          // Create a new one
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

      // Acknowledge the slash command ephemerally (only visible to the user)
      await interaction.reply({
        content: '✅',
        flags: 64, // Ephemeral
      });
    } catch (error) {
      console.error('Error executing /emote:', error);
      await interaction.reply({
        content: '❌ Something went wrong. Make sure I have Manage Webhooks permission in this channel.',
        flags: 64,
      });
    }
  },
};
