# StockPulse

StockPulse is a full-stack real-time market tracking and paper-trading application. It lets users monitor stocks and cryptocurrencies, view historical price charts, and place simulated buy and sell orders from a React dashboard.

The application uses Yahoo Finance market data through WebSockets for live prices and MongoDB to persist users, portfolios, orders, and transactions.

Demo video: [View the StockPulse demo](https://drive.google.com/file/d/1IZ_fT8jFdcbAbYcNocUHtS8pc1ALKZYI/view?usp=sharing)

## Features

- Google OAuth login and logout
- JWT-based authentication with protected API routes
- Real-time stock and cryptocurrency price updates over WebSockets
- Market dashboard with live price, daily change, and percentage change cards
- Search for stocks, ETFs, and cryptocurrencies using Yahoo Finance search
- Historical candlestick charts with selectable market history returned by the backend
- Paper trading with buy and sell orders
- Market orders and limit orders
- Automatic execution of pending limit orders when their requested price is reached
- Personal portfolio with holdings, invested value, current value, and profit/loss
- Order history with pending and executed order status
- Transaction history for completed trades
- Responsive React interface with loading states and toast notifications

## How it works

1. The frontend connects to the backend WebSocket server.
2. The backend subscribes to Yahoo Finance's streaming market data for stocks requested by connected clients.
3. Live prices are broadcast to the frontend and cached in memory for order execution.
4. Market orders are executed using the latest available price.
5. Limit orders remain pending until the live price reaches the requested limit, then the portfolio and transaction records are updated.

This is a paper-trading project. It does not place real trades with a broker.

## Tech stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Axios
- Lightweight Charts
- WebSockets

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- Passport Google OAuth 2.0
- JWT authentication
- WebSockets (`ws`)
- Protocol Buffers for decoding Yahoo Finance streaming messages

## Project structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB and Passport configuration
│   │   ├── middleware/   # Authentication middleware
│   │   ├── models/       # User, portfolio, order, and transaction models
│   │   ├── services/     # Order execution and live-price state
│   │   ├── sockets/      # Yahoo Finance and client WebSocket logic
│   │   ├── app.ts        # Express routes and middleware
│   │   └── index.ts      # Application entry point
│   └── protobuf/         # Yahoo Finance pricing message definition
└── frontend/
    └── src/
        ├── components/   # Dashboard, charts, search, and shared UI
        ├── contexts/     # WebSocket context
        ├── pages/        # Home, profile, portfolio, order, and detail pages
        ├── services/     # Authentication and API clients
        └── store/         # Redux authentication state
```

## Prerequisites

- Node.js 18 or later
- MongoDB
- Google OAuth 2.0 credentials
- A Yahoo Finance WebSocket URL/configuration supported by the backend

## Local setup

Clone the repository and install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create `backend/.env`:

```env
MONGO_URL=mongodb://127.0.0.1:27017/trading-app
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
SERVER_URL=http://localhost:8080
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
YAHOO_WS=your_yahoo_finance_websocket_url
PORT=8080
```

Create `frontend/.env`:

```env
VITE_SERVER_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```

For Google OAuth, add the following callback URL to the Google Cloud credentials:

```text
http://localhost:8080/auth/google/callback
```

## Run locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The backend is available at `http://localhost:8080` and the frontend at `http://localhost:5173`.

## Useful scripts

### Backend

```bash
npm run dev      # Start the backend with hot reload
npm run build    # Compile TypeScript
npm start        # Run the compiled backend
```

### Frontend

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## Main API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/auth/google` | Start Google login |
| `GET` | `/profile` | Get the authenticated user |
| `GET` | `/logout` | Clear the current session token |
| `GET` | `/getStocks/:stock` | Search for securities |
| `GET` | `/history/:stock` | Get historical chart data |
| `POST` | `/buy/:stock` | Place a buy order |
| `POST` | `/sell/:stock` | Place a sell order |
| `GET` | `/portfolio` | Get the user's portfolio |
| `GET` | `/orders` | Get the user's orders |
| `GET` | `/transactions` | Get the user's completed transactions |

Routes that access user data or place orders require authentication.

## Notes

- Market data availability depends on the upstream Yahoo Finance feed.
- The backend loads pending orders from MongoDB when it starts so limit-order processing can continue after a restart.
- To reset local application data, clear the MongoDB database named `trading-app`.
