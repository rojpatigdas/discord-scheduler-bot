# discord-scheduler-slash-commands

A Discord bot that allows users to schedule events via slash commands, automatically adding them to Google Calendar, notifying Discord, and optionally creating an Asana task. Integrates with n8n via webhook for automation.

## Features

- `/schedule`: Schedule an event with a modal form (title, date, time, description).
- `/help`: Get instructions on how to use the bot.
- Google Calendar integration via n8n webhook.
- Optional Asana task creation.
- Ephemeral responses for privacy.
- Supports custom test guild and global command registration.

## Prerequisites

- Node.js v16.9.0 or higher
- A Discord bot application with a token
- n8n workflow URL for webhook integration
- (Optional) Asana integration set up in your n8n workflow

## Enabling the Bot in Discord

1. **Create a Discord Application and Bot:**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Click **New Application**, give it a name, and save.
   - In the left sidebar, go to **Bot** and click **Add Bot**.
   - Under **Token**, click **Reset Token** and copy the token (you’ll use this in your `.env`).
   - Under **OAuth2 > General**, copy the **Client ID** (you’ll use this in your `.env`).

2. **Invite the Bot to Your Server:**
   - Go to **OAuth2 > URL Generator** in your application settings.
   - Under **Scopes**, select `bot` and `applications.commands`.
   - Under **Bot Permissions**, select `Send Messages`, `Embed Links`, and any other permissions your bot needs.
   - Copy the generated URL, open it in your browser, and invite the bot to your server.


## Setting Up n8n Automation

1. **Create a New Workflow in n8n:**
   - Add a **Webhook** node. Set the HTTP Method to `POST` and copy the webhook URL (use this as `WEBHOOK_URL` in your `.env`).
   - The bot will send a payload like:
     ```json
     {
       "title": "Event Title",
       "description": "Event Description",
       "start": "2024-05-01T10:00:00.000+08:00",
       "end": "2024-05-01T11:00:00.000+08:00",
       "formatted": "2024-05-01 10:00",
       "asana": true
     }
     ```
   - Add nodes to process this data:
     - **Google Calendar**: Use the event data to create a new event.
     - **Asana** (optional): If `asana` is `true`, create a task in Asana.
     - **Discord** (optional): Use a Discord node or webhook to send a confirmation message back to your server.

2. **Activate the Workflow:**
   - Make sure your workflow is active and the webhook is accessible from the internet.

3. **Update Your `.env`:**
   - Set `WEBHOOK_URL` to your n8n webhook URL.

## Setup

1. **Clone the repository:**
   ```