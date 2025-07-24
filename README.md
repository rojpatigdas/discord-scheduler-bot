
# 📆 Discord Scheduler Bot with n8n Integration

This is a demonstration project built to showcase automation expertise using **n8n**, **Discord**, **Google Calendar**, and optionally **Asana or Copper CRM**. The system allows users to schedule meetings via a slash command in Discord, and automates downstream tasks including event creation, Google Meet link generation, and task creation in a chosen platform.

---

## 📌 Project Purpose

This project was developed specifically for an **Automation Specialist demo**. My other real-world n8n workflows contain sensitive company and client data, so this clean and shareable build demonstrates my ability to:

- Design end-to-end automation systems
- Integrate multiple APIs and tools
- Build custom Discord bot logic
- Handle branching workflows, error handling, and third-party authentication

---

## ⚙️ Features

✅ `/schedule` command in Discord  
✅ Modal form input (title, date, time, description)  
✅ Real-time submission to an n8n webhook  
✅ Automatic Google Calendar event creation with Meet link  
✅ Notification back to Discord  
✅ Conditional creation of task in:
- Asana, or  
- Copper CRM  

---

## 🧠 Architecture Overview

```text
Discord (Slash Command + Modal)
         │
         ▼
n8n Webhook Node
         │
   ┌──────────────┐
   │ Google Calendar │ → Generates Meet link
   └──────────────┘
         │
         ▼
Discord: Confirmation message
         │
         ▼
IF node → Create Asana task / Create Copper CRM task
```

---

## 🛠 Technologies Used

- **n8n** (self-hosted or cloud)
- **Discord.js (Node.js)** for the slash command and modal
- **Google Calendar API**
- **Asana API** or **Copper CRM API**
- **Luxon** for time and date parsing

---

## 🚀 How to Run the Project

### 1. Clone the Bot
```bash
git clone https://github.com/yourusername/discord-n8n-scheduler.git
cd discord-n8n-scheduler
npm install
```

### 2. Set up Environment Variables
Create a `.env` file:
```
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
GUILD_ID=your_discord_server_id
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/scheduler
```

### 3. Register Commands
```bash
node register-commands.js
```

### 4. Run the Bot
```bash
node index.js
```

---

## 🧪 Testing

To test:
1. Type `/schedule` in any Discord channel where your bot is installed.
2. Fill in the modal with event details.
3. Select either **Asana** or **Copper** in the dropdown.
4. Check:
   - Google Calendar for the event with Meet link
   - Discord for the confirmation message
   - Asana/Copper for the created task

---


## 🙋‍♂️ About the Creator

👋 Hi, I’m **Rojenn Clyde G. Patigdas** — an automation specialist with experience building scalable n8n workflows for internal systems, client services, and productivity tools.  
I specialize in integrating CRMs, task managers, chat tools, and APIs into reliable automations.

📫 Contact me on [LinkedIn](https://www.linkedin.com/in/rojenn-clyde-patigdas-0993041a5) 

---

## 📝 License

This project is for demo and educational purposes only. Do not use in production without modifying authentication and data validation.
