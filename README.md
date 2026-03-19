<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# The Naming Nook

> Every pet is a story waiting for its perfect title. Discover the name they were always meant to have.

The Naming Nook is an AI-powered pet naming application built with React and Google Gemini. It features a guided wizard and an interactive chat to help you discover the perfect, personalized name for your new companion based on their species, personality, and your favorite naming themes.

[View this app in AI Studio](https://ai.studio/apps/3f785ab5-1c34-41d6-834f-7671a093c212) | [Live Demo](https://the-naming-nook.onrender.com/)

## ✨ Features

- **🧙‍♂️ Guided Wizard Mode:** A step-by-step process to define your pet's species, temperament, and naming theme to get highly personalized name suggestions.
- **💬 Interactive Chat Mode:** A conversational interface where you can chat naturally with the AI to find the perfect name, request specific constraints, or ask follow-up questions.
- **🎨 Beautiful UI:** Modern, responsive, and engaging design with smooth animations.
- **🤖 Powered by Google Gemini:** Leverages the Gemini API for creative and context-aware name generation.

## 🛠️ Tech Stack

- **Frontend:** React, Vite
- **Styling & UI:** Tailwind CSS, Framer Motion (animations), Lucide React (icons)
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Backend/Development Server:** Node.js, Express, TSX

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites

- Node.js installed on your machine.
- A Google Gemini API key. You can get one from Google AI Studio.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/your-username/the-naming-nook.git
   cd the-naming-nook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Create a `.env` file in the root directory.
   - You can copy the template from the existing `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Add your Gemini API key to the `.env` file:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   This will start the development server (typically on `http://localhost:3000`).

## 📦 Build for Production

To create a production build of the app:

```bash
npm run build
```

You can then run the built application using:
```bash
npm run start
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/the-naming-nook/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
