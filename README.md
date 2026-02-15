# 👟 Sneaker Drop Frontend

A real-time sneaker drop platform with live inventory updates and atomic reservations.

## ✨ Features

- **Real-Time Updates** - Live stock synchronization via WebSocket across all clients
- **60-Second Reservations** - Timed checkout window with automatic expiry
- **Activity Feed** - Recent purchaser list updated in real-time
- **Persistent State** - Reservations survive page reloads via localStorage
- **Responsive Design** - Mobile-first layout with Tailwind CSS

## 🛠️ Tech Stack

- **React 19** with Hooks
- **Vite 7** for fast builds
- **Tailwind CSS 4** for styling
- **Socket.IO** for real-time communication
- **localStorage** for state persistence

## 📁 Project Structure

```
src/
├── components/      # DropCard, DropsGrid, Toast, Header
├── hooks/           # useSocket, useRealTimeDrops, useToast
├── services/        # dropService (API calls)
├── pages/           # HomePage
├── utils/           # Configuration
└── static/          # Constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- Backend API running (default: `http://localhost:3001`)

### Installation

```bash
# Clone and install
git clone <repository-url>
cd sneaker-drop-frontend
npm install

# Configure environment
# Create .env file:
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001

# Start development server
npm run dev
```

Application runs at `http://localhost:5173`

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🏗️ Architecture

### DropCard Component (Three Modes)

1. **Card Mode** - Display drop info + "Reserve Now" button
2. **Form Mode** - Collect user details (name, email, size)
3. **Reserved Mode** - Show 60-second timer + "Complete Purchase" button

The component uses localStorage to persist reservations across page reloads.

### Real-Time Flow

```
Backend → WebSocket → useSocket → useRealTimeDrops → React State → UI Update
```

**Events:**

- `stock_update` - Updates available inventory
- `purchase_complete` - Refreshes purchaser list

### API Endpoints

- `GET /api/drops` - Fetch all drops
- `POST /api/drops/reserve` - Reserve a drop (returns reservationId)
- `POST /api/drops/purchase` - Complete purchase with reservationId

## 🐛 Troubleshooting

**WebSocket not connecting?**

- Ensure backend is running at `http://localhost:3001`
- Check CORS settings on backend
- Verify `VITE_SOCKET_URL` in `.env`

**API requests failing?**

- Verify backend API is accessible
- Check Network tab in DevTools
- Confirm `VITE_API_URL` is correct

**Reservation lost on reload?**

- Check if browser is in private/incognito mode (blocks localStorage)
- Try a different browser

**Build errors?**

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 Deployment

### Build for Production

```bash
npm run build
# Output: dist/ folder
```

### Environment Variables

Set these in your hosting platform:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

**Other Options:** Netlify, AWS S3, GitHub Pages

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Style:**

- Use functional components with React Hooks
- Follow ESLint configuration
- Keep components focused and reusable

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ⚡ Vite, ⚛️ React, and 🎨 Tailwind CSS**
