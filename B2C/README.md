# DirectBuyer (B2C) - Collective Procurement Platform

A premium marketplace for factory-direct collective buying, designed to skip middlemen and reduce the carbon footprint of global commerce.

## 🚀 Key Features
- **Collective Buying Pools**: Join batches to meet manufacturing minimums (MOQ) and unlock wholesale pricing.
- **Secure Escrow**: Built-in verification and escrow logic to ensure funds are only released upon quality audit.
- **Supplier Portal**: Dedicated dashboard for manufacturers to list batches and track production milestones.
- **Production-Ready Security**: 
  - JWT session management
  - Server-side password hashing (Bcrypt)
  - Protected API architecture (No SQL Injection risk)
  - Environment-based configuration

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, React Router, Context API
- **Backend**: Node.js, Express, JWT, BcryptJS
- **Database**: Turso (SQLite/libSQL)
- **Email Service**: EmailJS

## 📦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root based on `.env.example`:
```env
# Database
VITE_TURSO_URL=your_turso_url
VITE_TURSO_TOKEN=your_turso_token

# API
VITE_API_URL=http://localhost:3001/api
JWT_SECRET=your_jwt_secret
PORT=3001

# EmailJS
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

### 3. Database Initialization
Run the commands in `src/db/setup.sql` in your Turso CLI or Dashboard to prepare the schema.

### 4. Running the App
```bash
npm run dev
```
The app will run concurrently on port 5173 (Frontend) and 3001 (Backend).

## 🛡️ Security Audit Note
This application has been refactored for production readiness. All SQL operations are restricted to server-side endpoints, and sensitive credentials are never exposed to the client.

## 📄 License
Private Repository - Standard Intellectual Property Rules Apply.
