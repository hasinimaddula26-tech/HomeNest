# 🏠 HomeNest – Full-Stack Household Management Platform

HomeNest is a production-grade, secure full-stack web application designed to help families organize everyday activities, manage finances, secure personal files, and catalog contacts from a centralized, private portal.

This repository contains both the **React & TypeScript** frontend client and the **FastAPI & MySQL** backend API server, fully integrated and ready to run locally or in production.

---

## 🔗 Live Deployments
*   **Frontend Website:** [https://homenest-beta.vercel.app/](https://homenest-beta.vercel.app/)
*   **Backend API Services:** [https://homenest-backend-yw8c.onrender.com/](https://homenest-backend-yw8c.onrender.com/)
*   **Backend API Documentation:** [https://homenest-backend-yw8c.onrender.com/docs](https://homenest-backend-yw8c.onrender.com/docs)

---

## 🛠️ Complete Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 19 + TypeScript | High-performance client-side application with type safety. |
| **Styling** | Tailwind CSS | Modern, responsive glassmorphic interfaces. |
| **Backend API** | FastAPI (Python) | High-performance ASGI framework with auto-generated Swagger docs. |
| **ORM** | SQLAlchemy | Parameterized queries to map SQL tables to Python classes safely. |
| **Database** | MySQL | Hosted on Aiven Cloud with full SSL encryption and backups. |
| **Authentication**| JWT (JSON Web Tokens) | Stateless authorization and encrypted local token storage. |
| **Orchestration** | Docker & Compose | Multi-container setup containing Nginx, FastAPI, and MySQL. |

---

## 📂 Project Structure

```text
├── backend/            # FastAPI application source code
│   ├── app/            # Main application directory (models, routers, services)
│   ├── Dockerfile      # Containerization instructions for the API
│   ├── requirements.txt# Python dependency manifest
│   └── runtime.txt     # Locked Python version for Render (3.11.8)
├── frontend/           # React SPA application source code
│   ├── src/            # React components, pages, context, and configurations
│   ├── Dockerfile      # Containerization instructions for Nginx static host
│   └── package.json    # Frontend dependency manifest
├── docker-compose.yml  # Orchestrates full-stack services locally
└── runtime.txt         # Root runtime declaration for repository integrations
```

---

## 🚀 Setting Up and Running the Integrated App Locally

You can run the entire integrated stack locally either via **native terminal commands** or with **Docker Compose**.

### Method 1: Running with Docker Compose (Recommended)
Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
1.  Navigate to the repository root.
2.  Run the following command to build and launch all services:
    ```bash
    docker-compose up --build
    ```
3.  Once the build finishes:
    *   Access the **Frontend Web App** at [http://localhost:80](http://localhost:80)
    *   Access the **Backend API** at [http://localhost:8000](http://localhost:8000)

---

### Method 2: Running Natively
#### Step 1: Run the Backend
1.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Set up a virtual environment and install dependencies:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate
    
    pip install -r requirements.txt
    ```
3.  Create a `.env` file inside `backend/` containing:
    ```env
    DATABASE_URL=mysql+pymysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/defaultdb
    SECRET_KEY=supersecretfamilyhomenestkey
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```
4.  Launch the Uvicorn development server:
    ```bash
    uvicorn app.main:app --reload
    ```

#### Step 2: Run the Frontend
1.  Open a new terminal and navigate to the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file inside `frontend/` pointing to the local backend:
    ```env
    VITE_API_URL=http://localhost:8000
    ```
4.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Integration Challenges & Technical Solutions

During the integration of the React client with the FastAPI server and the Aiven MySQL database, several challenges were addressed:

### 1. Cross-Origin Resource Sharing (CORS) Restrictions
*   **Challenge:** The frontend, hosted on Vercel or localhost, was blocked by the browser when making API requests to the backend.
*   **Solution:** Configured FastAPI's `CORSMiddleware` in `app/main.py` to allow traffic from authorized origins, including localhost ports and production Vercel domains, with headers and cookie authorization enabled.

### 2. Aiven MySQL SSL Handshake Requirements
*   **Challenge:** Connecting to the hosted Aiven MySQL database failed in the production container due to SSL enforcement requirements.
*   **Solution:** Extended `app/core/database.py` to intercept connection requests targeting `aivencloud.com` and dynamically attach SQLAlchemy's `connect_args={"ssl": {}}` parameters. Additionally, wrote custom sanitization in `app/core/config.py` to strip out incompatible connection query parameters before instantiating the engine.

### 3. JWT Stateless Token Propagation
*   **Challenge:** Attaching authorization headers manually to every individual Axios request was error-prone and caused code duplication.
*   **Solution:** Implemented **Axios Interceptors** in the frontend client configuration. It intercepts every outgoing request, inspects `localStorage` for a valid JWT, and dynamically appends it under `Authorization: Bearer <TOKEN>`.

### 4. Non-Blocking Database Startup
*   **Challenge:** If the database took too long to respond on startup, the entire backend uvicorn worker hung and crashed, resulting in Render deployment timeouts.
*   **Solution:** Wrapped the database table creation sequence (`Base.metadata.create_all`) in a startup `try-except` block to allow the FastAPI server to boot and respond to health checks independently of database availability.
