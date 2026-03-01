require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Removing all slash commands...');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });

    console.log('✅ All slash commands removed.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
