# Match & Hire - Job Application Platform

A modern job application platform built with React, Node.js, and MongoDB, featuring user authentication, profile management, and job application tracking.

## 🌐 Deployed Applications

- Frontend: [https://match-n-hire.netlify.app](https://match-n-hire.netlify.app)
- Backend: [https://job-tinder.onrender.com](https://job-tinder.onrender.com)
- Database: MongoDB Atlas

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS & shadcn/ui for styling
- Firebase Authentication
- React Query for data fetching
- Zustand for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- TypeScript
- Firebase Admin SDK

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- MongoDB Atlas account
- Firebase account

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/adityaFE/match-n-hire.git
   cd match-n-hire
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Fill in the environment variables (see Configuration section below)

4. Start the development server:
   ```bash
   # Start frontend
   npm run dev

   # Start backend
   npm run start

   # Start both
   npm run start:dev 
   ```

## ⚙️ Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string and replace `<password>` with your database user password
5. Add the connection string to your `.env` file as `MONGO_URI`

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web application to your project
4. Enable Authentication (Email/Password and Google Sign-in)
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the configuration values
6. Add the following to your `.env` file:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 📦 Deployment

### Frontend Deployment (Netlify)
1. Create a Netlify account
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables:
   - Go to Site settings > Build & deploy > Environment variables
   - Add all VITE_* variables from your `.env` file
5. Deploy your site

### Backend Deployment (Render)
1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - Add all variables from your `.env` file
6. Deploy your service

## 📁 Project Structure

```
jobTinder-prod/
├── src/                    # Source files
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── lib/               # Library configurations
│   └── providers/         # Context providers
├── models/                # MongoDB models
├── public/               # Static files
├── server.ts             # Backend entry point
└── package.json          # Project dependencies
```

## 🔒 Security Notes
- Never commit `.env` file to version control
- Keep your API keys and secrets secure
- Use environment variables for all sensitive data
- Regularly update dependencies for security patches

## 🤝 Contributing
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details
