# Conner - Mental Health Chatbot

A modern, empathetic AI companion designed to support mental well-being through thoughtful conversations and personalized interactions.

## 🌟 Features

- **Conversational AI**: Engage with an AI companion trained specifically for mental health support
- **Multiple Chat Sessions**: Save and manage multiple conversation sessions
- **Personality Modes**: Choose between Supportive, Reflective, and Logical conversation styles
- **Dark/Light Theme**: Toggle between themes for comfortable usage
- **Export Functionality**: Export your chat history in JSON or TXT format
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Session Management**: Clear individual chats or all conversation history
- **User Authentication**: Secure login and account management

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AnujYadav-Dev/conner-mental-health-chatbot.git
cd conner-mental-health-chatbot
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your API configuration:

```env
CONNER_API_KEY=your_CONNER_API_KEY_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React Context API
- **Storage**: Local Storage for session persistence
- **AI Integration**: Open-source language models with fine-tuned system prompts

## 🎨 Customization

### System Prompts

The AI companion uses carefully crafted system prompts that can be customized in `src/utils/storage.js`:

```javascript
export const DEFAULT_SYSTEM_PROMPT =
  "You are Conner, an empathetic and reflective AI companion for mental well-being...";
```

### Personality Modes

The application supports three distinct personality modes:

- **Supportive**: Warm, encouraging, and validating responses
- **Reflective**: Thoughtful questions to help users reflect on their feelings
- **Logical**: Structured, analytical approach to problem-solving

### Theme Customization

Colors and themes can be customized in `tailwind.config.js` and `src/style.css`.

## 📱 Usage

### Getting Started

1. **Sign Up**: Create a new account with your email and name
2. **Login**: Access your saved conversations and settings
3. **Start Chatting**: Begin conversations with Conner
4. **Manage Sessions**: Save, export, or clear chat sessions as needed

### Features Overview

- **New Chat**: Start fresh conversations
- **Session History**: Access previously saved conversations
- **Settings**: Customize AI personality, theme, and preferences
- **Export Data**: Download your chat history for personal records
- **Clear Data**: Remove individual chats or all conversation history

## Privacy & Security

- All conversations are stored locally in your browser
- No data is sent to external servers without your explicit consent
- User authentication is handled securely with local storage
- Export functionality allows you to maintain control over your data

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Built with React and modern web technologies
- Inspired by the need for accessible mental health support
- Designed with empathy and user experience in mind

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/AnujYadav-Dev/conner-mental-health-chatbot/issues) page
2. Create a new issue with detailed information
3. For security concerns, please email directly

---

**Disclaimer**: This application is designed for general mental health support and conversation. It is not a replacement for professional mental health services. If you're experiencing a mental health crisis, please contact a qualified mental health professional or emergency services.
