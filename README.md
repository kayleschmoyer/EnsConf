# 🚀 Garage Config Dashboard

A futuristic, cyberpunk-themed web application for managing garage configurations in ML-based car counting systems. Built with Next.js, Three.js, and MongoDB.

## ✨ Features

- **🎨 Futuristic UI**: Dark theme with neon accents, glassmorphism, and smooth animations
- **🏗️ 3D Garage Builder**: Interactive 3D scene for placing cameras and sensors
- **📝 Config Management**: YAML/JSON editor with Monaco Editor
- **🔄 Real-time Updates**: Socket.io integration for live synchronization
- **🔐 Authentication**: Clerk authentication with Google sign-in
- **📊 Dashboard**: Overview with statistics and garage cards
- **⬇️ Export/Import**: Download configs and push to GitHub

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **3D Graphics**: Three.js, react-three-fiber, @react-three/drei
- **UI Components**: Radix UI (shadcn/ui)
- **Animations**: Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (with in-memory fallback)
- **Auth**: Clerk
- **Real-time**: Socket.io
- **Config**: YAML, JSON

## 📦 Installation

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Run development server
npm run dev:all
```

Visit http://localhost:3000

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── sign-in/          # Auth pages
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   ├── 3d/               # Three.js components
│   └── ...
├── server/               # Express.js backend
│   └── index.js         # Main server file
├── lib/                 # Utility functions
└── public/              # Static assets
```

## 🎯 Usage

1. **Sign in** with Google
2. **Create a garage** using the 3D builder
3. **Add cameras and sensors** in the 3D scene
4. **Generate configs** automatically
5. **Export** as YAML/JSON
6. **Deploy** your configuration

## 🌐 Environment Variables

Required variables (see `.env.local.example`):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `MONGODB_URI`
- `NEXT_PUBLIC_API_URL`
- `GITHUB_TOKEN` (optional)

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue first.