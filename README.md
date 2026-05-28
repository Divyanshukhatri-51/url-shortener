# 🔗 Premium URL Shortener

A modern, fast, and secure URL Shortener application built using **React** on the frontend and **Node.js/Express** on the backend, with data persistence in **MongoDB**. It features custom short links, real-time click tracking, input validation, and a sleek, responsive UI.

---

## ✨ Features

- **Quick Shortening**: Paste any long URL to instantly get a short, shareable link.
- **Custom Alias**: Choose your own custom short code (e.g., `my-custom-link`) instead of an auto-generated one.
- **Click Tracking**: Tracks and increments click counts in real-time when redirecting.
- **Instant UI Updates**: Clicking a shortened URL updates the click count on the dashboard immediately with an automated background sync.
- **Recent URLs Dashboard**: Displays the last 5 shortened links with their target URLs and click counts.
- **Solid Validation**: Robust checks for empty inputs, malformed URLs, already taken custom codes, and custom 404 pages for non-existent short links.
- **Premium Styling**: Glassmorphic, modern design built using Tailwind CSS and Lucide React icons.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- dotenv (Environment management)
- valid-url (URL structure verification)

---

## 📋 Prerequisites

Before setting up the project, make sure you have the following installed:
1. [Node.js](https://nodejs.org/) (v18.0.0 or higher is recommended)
2. [MongoDB](https://www.mongodb.com/try/download/community) (running locally on default port `27017` or a MongoDB Atlas URI)
3. npm (usually bundled with Node.js)

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### 1. Clone & Navigate
Navigate to the root directory of the project in your terminal:
```bash
cd URL
```

---

### 2. Backend Setup (`/server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and define the following variables:
   ```env
   PORT=3002
   MONGODB_URI=mongodb://localhost:27017/urlshortener
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should run on `http://localhost:3002` and log `Server running on port:3002` and `MongoDB connected`.*

---

### 3. Frontend Setup (`/client`)

1. Open a new terminal window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will start running and should be accessible at `http://localhost:5173`.*

---

## 📁 Project Structure

```text
URL/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── App.jsx         # Main dashboard and logical state
│   │   ├── main.jsx        # App entrypoint
│   │   └── index.css       # Tailwind imports & global styles
│   └── package.json
│
├── server/                 # Backend Node.js API
│   ├── controllers/
│   │   └── urlController.js# Logic for shortening and redirecting
│   ├── models/
│   │   └── Url.js          # MongoDB URL Mongoose Schema
│   ├── server.js           # Server initialization and routing
│   └── package.json
└── README.md
```

---

## 🌐 API Reference

### 1. Shorten a URL
* **URL**: `/api/shorten`
* **Method**: `POST`
* **Body**:
  ```json
  {
    "longUrl": "https://example.com/some/long/path",
    "customShortCode": "optionalCustomName"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "shortCode": "optionalCustomName",
    "shortUrl": "http://localhost:3002/optionalCustomName",
    "longUrl": "https://example.com/some/long/path",
    "clicks": 0
  }
  ```

### 2. Fetch Recent URLs
* **URL**: `/api/recent`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  [
    {
      "_id": "647b0a88efc...",
      "longUrl": "https://example.com/some/long/path",
      "shortCode": "optionalCustomName",
      "clicks": 1,
      "createdAt": "2026-05-28T08:00:00.000Z"
    }
  ]
  ```

### 3. Redirect Short Link
* **URL**: `/:shortCode`
* **Method**: `GET`
* **Details**: Redirects visitors to the corresponding `longUrl` using an HTTP `302 Temporary Redirect` status and increments the click counter. If the code does not exist, a custom 404 HTML error page is shown.
