# 🚀 HomeNest Deployment Guide

This guide outlines the step-by-step process to deploy the **HomeNest** full-stack application online. 

We will use free-tier hosting services:
* **Database**: MySQL on [Aiven.io](https://aiven.io/)
* **Backend**: FastAPI on [Render.com](https://render.com/)
* **Frontend**: React + TypeScript on [Vercel](https://vercel.com/)

---

## 🗺️ Deployment Architecture

```
React (Vercel)  ──(HTTPS)──>  FastAPI (Render)  ──(SQL)──>  MySQL (Aiven)
```

---

## 🗄️ Step 1: Deploy the Database (Aiven.io)

Aiven offers a free-tier managed MySQL database.

1. **Sign up**: Create an account on [Aiven.io](https://aiven.io/).
2. **Create Service**:
   * Click **Create Service**.
   * Select **MySQL**.
   * Choose the **Free Plan** (available in select regions like AWS `eu-north-1` or `us-east-1`).
   * Give it a name: `homenest-db`.
   * Click **Create Service**.
3. **Get Connection Details**:
   * Wait a few minutes for the status to show **Running**.
   * Under **Connection Information**, find:
     * **Host**
     * **Port** (usually `3306` or `10000+`)
     * **User** (usually `avnadmin`)
     * **Password**
     * **Database Name** (default is usually `defaultdb`, you can create a database called `homenest` under the *Databases* tab).
   * Construct your production `DATABASE_URL`:
     ```text
     mysql+pymysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/defaultdb
     ```
     > [!IMPORTANT]
     > If your password contains special characters (like `@`, `/`, `:`), you **must** URL-encode them (e.g., `@` becomes `%40`).

---

## 🐍 Step 2: Deploy the Backend API (Render.com)

Render integrates directly with your GitHub repository to build and deploy your Python code.

1. **Sign up**: Create an account on [Render.com](https://render.com/) and connect your GitHub account.
2. **Create Web Service**:
   * Click **New +** and select **Web Service**.
   * Select the **HomeNest** repository.
3. **Configure Settings**:
   * **Name**: `homenest-backend`
   * **Root Directory**: `backend`
   * **Language**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * **Instance Type**: `Free`
4. **Configure Environment Variables**:
   * Under the **Environment** tab, click **Add Environment Variable**:
     * `DATABASE_URL` = `mysql+pymysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/defaultdb`
     * `SECRET_KEY` = `generate-a-long-random-string` (e.g., `supersecretfamilyhomenestkey`)
5. **Deploy**:
   * Click **Deploy Web Service**.
   * Wait for the build to finish. Once complete, you will get a public URL (e.g., `https://homenest-backend.onrender.com`).
   * Test the backend by visiting `https://your-backend-url.onrender.com/docs` in your browser.

---

## ⚛️ Step 3: Deploy the Frontend (Vercel)

Vercel provides fast, free static hosting for Vite React applications.

1. **Sign up**: Create an account on [Vercel.com](https://vercel.com/) and link your GitHub account.
2. **Import Project**:
   * Click **Add New** -> **Project**.
   * Import the **HomeNest** repository.
3. **Configure Settings**:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build & Development Settings**: Keep defaults (Vercel automatically detects Vite).
4. **Configure Environment Variables**:
   * Under **Environment Variables**, add:
     * `VITE_API_URL` = `https://your-backend-url.onrender.com` (use your actual Render backend URL *without* a trailing slash).
5. **Deploy**:
   * Click **Deploy**.
   * Once finished, you will receive your live, shareable application URL (e.g., `https://homenest.vercel.app`)!

---

## 🔍 Verification Checklist

After deploying all three parts, verify the following:

- [ ] Open the Vercel link and check if the landing page loads.
- [ ] Try navigating to `/register` and create an account. Verify that the request goes to Render and successfully inserts a user record in Aiven MySQL.
- [ ] Check off a grocery item on the dashboard to test real-time write operations.
