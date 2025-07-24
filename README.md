# discord-scheduler-slash-commands

A Discord bot that allows users to schedule events via slash commands, automatically adding them to Google Calendar, notifying Discord, and optionally creating an Asana task. Integrates with n8n via webhook for automation.

---

## ✨ Features

- `/schedule`: Schedule an event with a modal form (title, date, time, description).
- `/help`: Get instructions on how to use the bot.
- Google Calendar integration via n8n webhook.
- Optional Asana task creation.
- Ephemeral responses for privacy.
- Supports custom test guild and global command registration.

---

## ⚙️ Prerequisites

- Node.js v16.9.0 or higher
- A Discord bot application with a token
- n8n workflow URL for webhook integration
- (Optional) Asana integration set up in your n8n workflow

---

## 🚀 Enabling the Bot in Discord

### 1. Create a Discord Application and Bot

- Go to the [Discord Developer Portal](https://discord.com/developers/applications)
- Click **New Application**, give it a name, and save.
- In the left sidebar, go to **Bot** and click **Add Bot**.
- Under **Token**, click **Reset Token** and copy the token (you’ll use this in your `.env`).
- Under **OAuth2 > General**, copy the **Client ID** (you’ll use this in your `.env`).

### 2. Invite the Bot to Your Server

- Go to **OAuth2 > URL Generator** in your application settings.
- Under **Scopes**, select `bot` and `applications.commands`.
- Under **Bot Permissions**, select:
  - `Send Messages`
  - `Embed Links`
  - And any other permissions your bot needs
- Copy the generated URL, open it in your browser, and invite the bot to your server.

---

## 🔁 Setting Up n8n Automation

### 1. Create a New Workflow in n8n

- Add a **Webhook** node. Set the HTTP Method to `POST` and copy the webhook URL.
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

- Add nodes to process the data:
  - **Google Calendar**: Use the event data to create a new event.
  - **Asana** (optional): If `asana` is `true`, create a task in Asana.
  - **Discord** (optional): Use a Discord node or webhook to send a confirmation message back to the server.

### 2. Activate the Workflow

- Ensure your workflow is **active** and the webhook is accessible publicly.

### 3. Update Your `.env`

```env
WEBHOOK_URL=https://your-n8n-instance/webhook/your-workflow
```

---

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rojpatigdas/discord-scheduler-bot.git
cd discord-scheduler-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` File

```env
TOKEN=your-discord-bot-token
CLIENT_ID=your-discord-application-client-id
GUILD_ID=your-test-guild-id     # Only needed for development registration
WEBHOOK_URL=https://your-n8n-instance/webhook/your-workflow
```

---

## 💡 Usage

### Register Slash Commands

- **For a test server (recommended during development):**

```bash
npm run register
```

- **For global registration (production):**

The bot will register global commands automatically on startup.

### Start the Bot

```bash
npm start
```

### Commands

- `/schedule`: Opens a modal to input event details. After submitting, you can choose whether to create an Asana task.
- `/help`: Shows usage instructions and formatting tips.

---

## 🌐 Environment Variables

| Variable      | Description                                 |
|---------------|---------------------------------------------|
| `TOKEN`       | Discord bot token                           |
| `CLIENT_ID`   | Discord application client ID               |
| `GUILD_ID`    | Discord server (guild) ID for test commands |
| `WEBHOOK_URL` | n8n webhook URL for event handling          |

---

## 🔄 Event Flow

1. User runs `/schedule` and fills out the modal.
2. Bot validates input and prompts for Asana task creation.
3. On confirmation, bot sends event data to the configured n8n webhook.
4. n8n handles Google Calendar and (optionally) Asana automation.

---

## 📦 Dependencies

- [discord.js](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [luxon](https://moment.github.io/luxon/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)

---

## 🪪 License

ISC
