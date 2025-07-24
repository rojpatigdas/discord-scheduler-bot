require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('📅 Schedule an event'),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('❓ Learn how to use the scheduling bot'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🛠 Registering slash commands to test guild...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log('✅ Commands registered to test server!');
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
})();
