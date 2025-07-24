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

## Setup

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd discord-scheduler-slash-commands
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory with the following content:
   ```
   TOKEN=your-discord-bot-token
   CLIENT_ID=your-discord-application-client-id
   GUILD_ID=your-test-guild-id   # Only needed for test server registration
   WEBHOOK_URL=https://your-n8n-instance/webhook/your-workflow
   ```

## Usage

### Register Slash Commands

- **For a test server (recommended during development):**
  ```sh
  npm run register
  ```
  This registers the `/schedule` and `/help` commands to your test guild.

- **For global registration (production):**
  The bot will automatically register global commands on startup.

### Start the Bot

```sh
npm start
```

### Commands

- `/schedule`: Opens a modal to input event details. After submitting, you can choose whether to create an Asana task.
- `/help`: Shows usage instructions and formatting tips.

## Environment Variables

| Variable     | Description                                 |
|--------------|---------------------------------------------|
| TOKEN        | Discord bot token                           |
| CLIENT_ID    | Discord application client ID               |
| GUILD_ID     | Discord server (guild) ID for test commands |
| WEBHOOK_URL  | n8n webhook URL for event handling          |

## Event Flow

1. User runs `/schedule` and fills out the modal.
2. Bot validates input and asks if an Asana task should be created.
3. On confirmation, bot sends event data to the configured n8n webhook.
4. n8n handles Google Calendar and Asana integration.

## Dependencies

- [discord.js](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [luxon](https://moment.github.io/luxon/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)

## License

ISC

