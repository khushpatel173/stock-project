# Stock Project

A full-stack stock trading app with a TypeScript/Node.js backend and a React + Vite frontend.

## Prerequisites

- Node.js installed
- MongoDB running locally at `mongodb://127.0.0.1:27017/trading-app`
- Google OAuth credentials for login

## Project Structure

- `backend/` - Express, MongoDB, Passport Google login, and websocket/market data logic
- `frontend/` - React UI built with Vite

## Local Setup

Install dependencies in both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create a `.env` file in `backend/` with:

```env
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
```

## Run Locally

Start the backend from the `backend/` folder:

```bash
npm run dev
```

The backend runs on `http://localhost:8080`.

Start the frontend from the `frontend/` folder in a separate terminal:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Notes

- The backend uses Google OAuth with the callback URL `http://localhost:8080/auth/google/callback`.
- The frontend expects the backend to be running locally on port `8080`.
- If you need to reset local data, clear the MongoDB database named `trading-app`.
