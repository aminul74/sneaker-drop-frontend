# 👟 Sneaker Drop Frontend

A modern, real-time sneaker drop tracking and reservation application built with React, Vite, and Tailwind CSS. Get instant notifications for limited-edition shoe releases and reserve your pairs before they sell out!

## ✨ Features

- **Real-Time Updates** - Live inventory tracking with Socket.IO for instant stock updates
- **Countdown Timers** - Dynamic countdown for upcoming drops with hours and minutes display
- **Reservation System** - Quick reservation process with 60-second confirmation window
- **Responsive Design** - Mobile-first approach supporting all device sizes
- **Smooth Animations** - Polished UI with hover effects, transitions, and loading states
- **Toast Notifications** - Non-intrusive feedback system for user actions
- **Beautiful UI** - Dark theme with gradient backgrounds and modern card layouts
- **Size Selection** - Support for multiple shoe sizes (US 7 to 12)

## 🛠️ Tech Stack

- **Frontend Framework** - React 19.2
- **Build Tool** - Vite 7.3
- **Styling** - Tailwind CSS 4.1
- **Real-Time Communication** - Socket.IO Client 4.8
- **Linting** - ESLint 9.39
- **Package Manager** - npm

## 📁 Project Structure

```
sneaker-drop-frontend/
├── src/
│   ├── components/
│   │   ├── DropCard.jsx           # Individual drop card component
│   │   ├── DropsGrid.jsx          # Grid layout for drops
│   │   ├── ReservationModal.jsx   # Reservation form modal
│   │   ├── EmptyState.jsx         # Empty state display
│   │   ├── Toast.jsx              # Notification component
│   │   ├── Header.jsx             # App header
│   │   └── index.js               # Components barrel export
│   ├── hooks/
│   │   ├── useSocket.js           # Socket.IO connection hook
│   │   ├── useRealTimeDrops.js    # Real-time drops data hook
│   │   ├── useToast.js            # Toast notifications hook
│   │   └── index.js               # Hooks barrel export
│   ├── pages/
│   │   └── HomePage.jsx           # Main home page
│   ├── static/
│   │   └── constants.js           # App constants
│   ├── utils/
│   │   └── config.js              # Configuration file
│   ├── assets/                    # Static assets
│   ├── App.jsx                    # Main App component
│   ├── App.css                    # App styles
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── public/                        # Public assets
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint configuration
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on `http://localhost:3001`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sneaker-drop-frontend.git
   cd sneaker-drop-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create a .env file in the root directory
   VITE_API_URL=http://localhost:3001/api
   VITE_SOCKET_URL=http://localhost:3001
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📝 Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run lint`    | Run ESLint to check code quality         |
| `npm run preview` | Preview production build locally         |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### Tailwind CSS Configuration

The project uses Tailwind CSS v4 with custom theme configuration in `tailwind.config.js`:

- Custom color palette with dark theme
- Responsive breakpoints for mobile-first design
- Custom animations for smooth transitions

## 🎨 Component Overview

### DropCard

Displays individual sneaker drop information with:

- Product image or placeholder
- Countdown timer
- Price and availability
- Reserve button with hover effects

### ReservationModal

Modal form for making reservations with:

- User information collection
- Size selection dropdown
- Real-time countdown timer (60 seconds)
- Purchase confirmation flow

### Toast

Non-intrusive notification system for:

- Successful reservations
- Purchase confirmations
- Error messages

### DropsGrid

Responsive grid layout with proper alignment:

- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop

## 🔌 API Integration

The frontend communicates with the backend through:

**REST API Endpoints:**

- `GET /api/drops` - Fetch all available drops
- `POST /api/drops/reserve` - Create a reservation
- `POST /api/drops/purchase` - Complete purchase

**WebSocket Events:**

- `stock-updated` - Receive real-time stock updates
- `drop-started` - New drop has started
- `drop-sold-out` - Drop has sold out

## 🎯 Key Features Explained

### Real-Time Updates

The app uses Socket.IO to maintain a persistent connection with the backend for instant inventory updates without page refreshes.

### Countdown Timer

Each drop displays a live countdown showing hours and minutes until the release. Once live, it displays "LIVE NOW!" status.

### Reservation Window

After reserving an item, users have 60 seconds to complete the purchase. The timer counts down in the modal, and the reservation expires if not completed in time.

### Responsive Design

Built with Tailwind CSS to ensure consistent experience across all devices:

- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## 🐛 Troubleshooting

### WebSocket Connection Issues

- Ensure backend server is running on `http://localhost:3001`
- Check CORS settings on backend
- Verify `VITE_SOCKET_URL` environment variable

### API Errors

- Confirm backend API is accessible
- Check network tab in browser DevTools
- Verify token/authentication if required

### Build Issues

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## 📦 Production Build

To build for production:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

Preview the production build locally:

```bash
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ for sneaker enthusiasts

## 🔗 Related Projects

- [Sneaker Drop Backend](https://github.com/aminul74/sneaker-drop-backend) - Backend API server

## 📧 Support

For support, email a.soton7@gmail.com or open an issue in the GitHub repository.

---

**Happy sneaker hunting! 👟✨**
