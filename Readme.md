# FitPulse: Health Tracker Application

This repository contains a full-stack application built with a Python Flask server (backend) and a Next.js (React) client (frontend). The app enables users to track various health metrics such as steps, water intake, sleep hours, and heart rate, with powerful trend visualizations on the dashboard.

---

## 🖥 Client (Frontend)

- **Framework:** Next.js (React)
- **Folder:** `client/`
- The frontend provides a responsive and interactive dashboard for users to view trends and log data.

### To Start the Client

1. **Install dependencies** (using pnpm):

   ```
   pnpm i
   ```

2. **Environment Variables (.env file):**

   Create a `.env` file in the `client/` directory to set environment variables.

   ```
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1::5000
   ```

   Make sure to restart the development server after editing the `.env` file.

3. **Start the development server**:

   ```
   pnpm run dev
   ```

   The app will typically run at `http://localhost:3000`.

---

## 🐍 Server (Backend)

- **Framework:** Flask (Python)
- **Folder:** `server/`
- The backend handles user authentication, stores and retrieves wellness logs, and exposes an API for the frontend.

### To Start the Server

1. **Create a virtual environment:**

   ```
   python3 -m venv venv
   ```

2. **Activate the virtual environment:**

   - **For Linux/Mac:**
     ```
     source venv/bin/activate
     ```
   - **For Windows:**
     ```
     venv\Scripts\activate
     ```

3. **Install dependencies:**

   ```
   pip install -r requirements.txt
   ```

   Create a `.env` file in the `server/` directory to set environment variables for the backend.

   ```
   DATABASE_URL=postgresql://[username]:[password]@localhost:5432/[db_name]
   SECRET_KEY= YOUR SECRET KEY
   JWT_SECRET_KEY=YOUR SECRET KEY
   JWT_EXP_SECONDS=43200
   SERVER_PORT=5000
   ```

   Adjust these values as needed for your environment and security requirements.

   After editing or creating the `.env` file, be sure to restart the backend server.

4. **Run the Flask server:**

   ```
   python run.py
   ```

   By default, the backend runs at `http://127.0.0.1:5000/`.

   To check the api documentation: `http://127.0.0.1:5000/apidocs`.

---

## 📦 Project Structure

```
client/   // Frontend: Next.js app
server/   // Backend: Flask app
```

---

## 🚀 Getting Started

1. Start both **server** and **client** as described above.
2. Access the frontend UI in your browser (usually `localhost:3000`).
3. The frontend will communicate automatically with the backend API.

---

Enjoy tracking your health metrics!
