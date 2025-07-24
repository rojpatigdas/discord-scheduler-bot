require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  InteractionType,
  REST,
  Routes,
  SlashCommandBuilder,
  MessageFlags,
} = require('discord.js');
const { DateTime } = require('luxon');
const fetch = require('node-fetch');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName('schedule')
      .setDescription('📅 Schedule an event and optionally create an Asana task'),
    new SlashCommandBuilder()
      .setName('help')
      .setDescription('❓ Learn how to use the scheduling bot'),
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('🌐 Registering global slash commands...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log('✅ Commands registered: /schedule, /help');
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === 'help') {
    await interaction.reply({
      embeds: [
        {
          title: '📖 How to Use the Scheduler Bot',
          description: 'Use `/schedule` to schedule an event in Google Calendar, notify Discord, and optionally create an Asana task.',
          color: 0x5865f2,
          fields: [
            { name: '📝 Step 1', value: 'Run `/schedule` and fill out the form.' },
            { name: '📅 Step 2', value: 'Bot will add to Google Calendar, notify Discord, and optionally create an Asana task.' },
            { name: '📆 Date Format', value: '`YYYY-MM-DD`' },
            { name: '🕒 Time Format', value: '`HH:MM` (24-hour format)' },
          ],
        },
      ],
      ephemeral: true,
    });
  }

  if (interaction.isChatInputCommand() && interaction.commandName === 'schedule') {
    const modal = new ModalBuilder()
      .setCustomId('schedule_modal')
      .setTitle('📅 Schedule an Event');

    const title = new TextInputBuilder()
      .setCustomId('event_title')
      .setLabel('Event Title')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const date = new TextInputBuilder()
      .setCustomId('event_date')
      .setLabel('Date (YYYY-MM-DD)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const time = new TextInputBuilder()
      .setCustomId('event_time')
      .setLabel('Time (24hr HH:MM)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const description = new TextInputBuilder()
      .setCustomId('event_description')
      .setLabel('Description')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(title),
      new ActionRowBuilder().addComponents(date),
      new ActionRowBuilder().addComponents(time),
      new ActionRowBuilder().addComponents(description)
    );

    await interaction.showModal(modal);
  }

  if (
    interaction.type === InteractionType.ModalSubmit &&
    interaction.customId === 'schedule_modal'
  ) {
    const title = interaction.fields.getTextInputValue('event_title');
    const dateStr = interaction.fields.getTextInputValue('event_date');
    const timeStr = interaction.fields.getTextInputValue('event_time');
    const description = interaction.fields.getTextInputValue('event_description') || 'No description';

    const dt = DateTime.fromFormat(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', {
      zone: 'Asia/Manila',
    });

    if (!dt.isValid) {
      await interaction.reply({
        content: '❌ Invalid date/time format. Use `YYYY-MM-DD` and `HH:MM` (24hr).',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('asana_select')
        .setPlaceholder('Create an Asana Task?')
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel('Yes')
            .setDescription('Create an Asana task too')
            .setValue('yes'),
          new StringSelectMenuOptionBuilder()
            .setLabel('No')
            .setDescription('Skip Asana task')
            .setValue('no')
        )
    );

    const eventData = {
      title,
      description,
      start: dt.toISO(),
      end: dt.plus({ minutes: 60 }).toISO(),
      formatted: dt.toFormat('yyyy-MM-dd HH:mm'),
    };

    interaction.client.pendingEvents = interaction.client.pendingEvents || new Map();
    interaction.client.pendingEvents.set(interaction.user.id, eventData);

    await interaction.reply({
      content: '✅ Event details saved. Do you want to create an Asana task?',
      components: [selectRow],
      flags: MessageFlags.Ephemeral,
    });
  }

  if (
    interaction.isStringSelectMenu() &&
    interaction.customId === 'asana_select'
  ) {
    const choice = interaction.values[0];
    const createAsana = choice === 'yes';
    const eventData = interaction.client.pendingEvents?.get(interaction.user.id);

    if (!eventData) {
      await interaction.update({
        content: '❌ No event found. Please try `/schedule` again.',
        components: [],
      });
      return;
    }

    try {
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventData, asana: createAsana }),
      });

      await interaction.update({
        content: `✅ Event sent to Google Calendar. Discord notified. ${createAsana ? 'Asana task created.' : 'Asana skipped.'}`,
        components: [],
      });
    } catch (err) {
      console.error('❌ Error sending to n8n:', err);
      await interaction.update({
        content: '❌ Failed to send event. Please try again later.',
        components: [],
      });
    }

    interaction.client.pendingEvents?.delete(interaction.user.id);
  }
});

client.login(process.env.TOKEN);
