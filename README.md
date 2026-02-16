# 🎙️ VoxStrangers - Anonymous Voice Chat

A real-time, anonymous voice chat application where you can connect with strangers globally using WebRTC and Socket.io. Built with React, Vite, Tailwind CSS, and Node.js.

---

## ✨ Features

- **🌍 Anonymous Voice Chat**: Connect and chat with random strangers across the globe
- **🎤 Real-Time Audio**: Peer-to-peer audio streaming using WebRTC
- **🌙 Dark/Light Mode**: Beautiful theme switching for comfortable viewing
- **👥 Friend System**: Save and call your favorite strangers directly
- **🌐 Country Filters**: Filter matches by preferred or excluded countries
- **🎨 Modern UI**: Clean, responsive design built with Tailwind CSS
- **⚡ Fast Development**: Powered by Vite for instant HMR
- **🔒 Anonymous**: No personal information required

---

## 🏗️ Project Structure

```
voxstrangers-anonymous-voice-chat/
├── frontend/                          # React + Vite frontend app
│   ├── components/                    # React components
│   │   ├── AudioVisualizer.jsx
│   │   ├── ChatInterface.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── FriendSidebar.jsx
│   │   ├── Header.jsx
│   │   └── LandingPage.jsx
│   ├── services/
│   │   └── webrtc.js                  # WebRTC configuration & peer connection
│   ├── utils/
│   │   └── usernameGenerator.js       # Anonymous username generator
│   ├── App.jsx                        # Main app component
│   ├── index.jsx                      # React entry point
│   ├── index.html                     # HTML template
│   ├── index.css                      # Tailwind directives
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── postcss.config.cjs             # PostCSS configuration
│   └── types.js                       # Type definitions (JSDoc)
│
├── backend/                           # Node.js signaling server
│   ├── server/
│   │   └── mockServer.js              # Socket.io signaling server
│   ├── package.json                   # Backend dependencies
│   └── README.md                      # Backend documentation
│
├── .gitignore
├── README.md
└── package.json

```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anuragsah401/voxstranger.git
   cd voxstrangers-anonymous-voice-chat
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running Locally

You need to run both the backend and frontend servers simultaneously:

**Terminal 1 - Start the Backend Signaling Server (port 3001):**
```bash
cd backend
npm start
```

**Terminal 2 - Start the Frontend Dev Server (port 3000 or higher):**
```bash
cd frontend
npm run dev
```

Then open your browser to the URL shown in the terminal (typically `http://localhost:3000`).

---

## 📦 Frontend Dependencies

- **React** ^19.2.4 - UI library
- **Vite** ^6.2.0 - Build tool & dev server
- **Tailwind CSS** ^4.1.18 - Utility-first CSS framework
- **PostCSS** ^8.5.6 - CSS processing
- **Autoprefixer** ^10.4.24 - CSS vendor prefixes
- **@google/genai** ^1.41.0 - Google Generative AI (optional)

## 📦 Backend Dependencies

- **Express** ^4.18.2 - Web server framework
- **Socket.io** ^4.7.2 - Real-time communication (WebSocket)
- **UUID** ^9.0.1 - Unique identifier generation

---

## 🎯 How It Works

### Frontend Flow
1. User logs in with an anonymous username
2. Clicks "Start Chat" to search for a random stranger
3. Once matched, WebRTC connection is established
4. Voice data is streamed peer-to-peer (not through servers)
5. Can save matched users to "Friends" list
6. Can apply country filters to match preferences

### Backend (Signaling Server)
1. Manages user connection queue
2. Matches users waiting for a chat partner
3. Relays WebRTC signaling messages (offer/answer/ICE candidates)
4. Does NOT relay media data (all audio is P2P)

### WebRTC Architecture
- Uses Google's STUN servers for NAT traversal
- Peer-to-peer audio streaming using MediaStream API
- ICE candidate gathering for connection optimization

---

## 🌙 Dark Mode / Light Mode

The app supports beautiful dark and light themes:
- **Dark Mode**: Elegant dark UI (default)
- **Light Mode**: Clean, bright interface
- Theme preference is saved to localStorage
- Toggle via the theme button in the header

---

## 🌍 Country Filtering

Users can:
- **Prefer specific countries**: Only match with users from selected countries
- **Exclude countries**: Never match with users from excluded countries
- Search and add multiple filters
- Clear filters anytime

---

## 👥 Friend System

- **Save strangers**: Add matched users to your friend list
- **Direct calls**: Call saved friends directly without searching
- **Friend status**: See if friends are online
- **Persistent storage**: Friends list is saved in localStorage

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the `frontend/` folder (optional):
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_api_key_here
```

### Tailwind Dark Mode

Dark mode is enabled via the `darkMode: 'class'` setting in `tailwind.config.js`, which allows toggling dark mode by adding the `dark` class to the `<html>` element.

---

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

Media queries and Tailwind's responsive utilities ensure a great experience across all screen sizes.

---

## 🚢 Deployment

### Deploy Frontend

**Option 1: Vercel (Recommended)**
```bash
cd frontend
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
cd frontend
npm run build
# Drag and drop the 'dist' folder to netlify.com
```

**Option 3: GitHub Pages / Any Static Host**
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting
```

### Deploy Backend

**Option 1: Render (Recommended)**
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create a new Web Service and connect your repo
4. Set start command: `node server/mockServer.js`
5. Deploy

**Option 2: Railway**
1. Go to [railway.app](https://railway.app)
2. Create a new project and link your GitHub repo
3. Set start command: `node server/mockServer.js`
4. Deploy

**Option 3: Heroku / DigitalOcean / AWS**
1. Follow platform-specific deployment guides
2. Ensure Node.js is available
3. Set environment variable `PORT` (default 3001)

### Update Frontend to Use Deployed Backend

After deploying the backend, update the frontend `.env.local`:
```env
VITE_BACKEND_URL=https://your-backend-url.com
```

---

## 🛠️ Available Scripts

### Frontend
```bash
cd frontend
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm start        # Start signaling server on port 3001
npm run dev      # Same as npm start
```

---

## 📋 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

WebRTC requires HTTPS in production (except localhost).

---

## 🔐 Privacy & Security

- ✅ No personal data collection
- ✅ Anonymous usernames generated client-side
- ✅ Peer-to-peer audio (encrypted between peers)
- ✅ No voice data stored on servers
- ⚠️ Production deployment should use HTTPS
- ⚠️ Consider adding user moderation/reporting for production

---

## ⚙️ Technical Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 6, Tailwind CSS 4 |
| **Styling** | Tailwind CSS with PostCSS |
| **Real-Time Communication** | Socket.io, WebRTC |
| **Backend** | Node.js, Express, Socket.io |
| **Build & Dev** | Vite, Webpack (optional) |
| **Database** | None (stateless) |

---

## 🐛 Troubleshooting

### Dark Mode Not Working
- Ensure `darkMode: 'class'` is in `tailwind.config.js`
- Clear browser cache and reload
- Check that the `dark` class is being applied to `<html>`

### WebRTC Connection Issues
- Check browser console for errors
- Ensure both frontend and backend are running
- Try disabling VPN/proxy
- Use Chrome DevTools to debug WebRTC connections

### Backend Not Starting
- Check if port 3001 is available: `lsof -i :3001`
- Ensure dependencies are installed: `cd backend && npm install`
- Check Node.js version: `node --version` (should be v14+)

### Tailwind Styles Not Showing
- Run `npm install` in the frontend folder
- Clear `.next` or `dist` folder if it exists
- Restart dev server: `npm run dev`

---

## 📝 License

MIT License - feel free to use this project for personal and commercial purposes.

---

## 👤 Author

**Anurag** - [GitHub](https://github.com/Anuragsah401)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 🙏 Acknowledgments

- WebRTC for peer-to-peer communication
- Socket.io for real-time signaling
- Google STUN servers for NAT traversal
- Tailwind CSS for beautiful styling
- React community for amazing tools

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/Anuragsah401/voxstranger/issues)
- Check existing issues for solutions
- Provide detailed error messages and steps to reproduce

---

**Made with ❤️ for global connectivity**
