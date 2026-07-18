# 🚀 HomeNest - Deployment, Maintenance & Project Reflection Report

This comprehensive document serves as the final report for the HomeNest platform. It contains the **Deployment Guide**, **Maintenance Documentation**, and **Project Reflection Analysis**.

---

## 🗺️ 1. Deployment Architecture

```text
React Client (Vercel)  ──(HTTPS/JSON)──>  FastAPI API (Render)  ──(SSL/SQL)──>  MySQL (Aiven Cloud)
```

---

## 🗄️ 2. Detailed Deployment Guide

The application is deployed as three decoupled components to public cloud platforms:

### A. Database Deployment (Aiven Cloud)
1.  Sign up on [Aiven.io](https://aiven.io/) and create a free MySQL service instance.
2.  Obtain the connection host, port, username (`avnadmin`), and password.
3.  Configure the service database connection settings to enable **Open Access** IP filtering (`0.0.0.0/0`) to allow connections from Render's dynamic backend IP pool.
4.  Construct the database URI:
    `mysql+pymysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/defaultdb`

### B. Backend API Deployment (Render)
1.  Log in to [Render.com](https://render.com/) and create a new **Web Service** connected to your GitHub repository.
2.  Set the **Root Directory** to `backend`.
3.  Set the **Build Command** to: `pip install -r requirements.txt`.
4.  Set the **Start Command** to: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5.  In the environment variables tab, define:
    *   `DATABASE_URL`: Connection string to Aiven MySQL.
    *   `SECRET_KEY`: Long random string for JWT hashing.
    *   `ACCESS_TOKEN_EXPIRE_MINUTES`: `30` (or desired timeout).
6.  Click deploy. Render builds and hosts the API at `https://homenest-backend-yw8c.onrender.com`.

### C. Frontend Deployment (Vercel)
1.  Log in to [Vercel.com](https://vercel.com/) and import the repository.
2.  Set the **Root Directory** to `frontend`.
3.  Vercel automatically detects the Vite configuration and sets the build settings to:
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
4.  Configure the Environment Variable:
    *   `VITE_API_URL`: `https://homenest-backend-yw8c.onrender.com` (backend root URL).
5.  Deploy. Vercel hosts the responsive SPA client at `https://homenest-beta.vercel.app`.

---

## 🔧 3. Troubleshooting Common Deployment Issues

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **CORS Policy Errors** | Browser blocks frontend domain calls to the backend API. | Add Vercel domain to `origins` array in FastAPI `CORSMiddleware` config. |
| **Aiven DB Handshake Failures** | Aiven forces secure SSL connections which PyMySQL rejects by default. | Detect `aivencloud.com` in `DATABASE_URL` and dynamically append `connect_args={"ssl": {}}` when creating engine. |
| **Render Build Timeouts** | Uvicorn start fails because backend blocks waiting for a slow DB startup response. | Wrap schema creations (`create_all`) in non-blocking try-except blocks during FastAPI startup lifecycles. |
| **GitHub Push Protection Blocks** | Hardcoded passwords or secret keys in files (e.g. database password in a script). | Move secrets to `.env` file variables (which are git-ignored) and replace raw credentials with placeholders. |

---

## 🛡️ 4. Maintenance & Support Strategy

To guarantee the reliability, security, and continuous health of the application, we implement the following maintenance steps:

### A. Logging & Monitoring
*   **FastAPI & Uvicorn Logs:** Access and error logs are automatically piped to stdout/stderr, which Render aggregates in real-time under their web service log portal.
*   **Database Audit Trail (`activities` table):** Major user transactions (e.g. checking off groceries, adding bills) write an audit log row to the `activities` database table. This provides a user-facing event log on the dashboard.

### B. Error Handling & Reporting
*   All validation failures are intercepted by FastAPI and returned as clean JSON payloads (`422 Unprocessable Entity`) indicating the failing fields.
*   Production exception middlewares capture untracked `500 Server Errors` and return generic messages to the client while logging stack traces on the server to prevent exposing system details to end users.

### C. Backups & Schema Updates
*   **Database Backups:** Aiven Cloud performs daily automated database backups with a 2-day point-in-time recovery window on the free plan.
*   **Database Migrations:** Schema changes are versioned and executed incrementally. A cleanup script (`reset_remote_db.py`) is provided for developers to safely reset tables during staging resets.

---

## 💡 5. Project Reflection & Retrospective

### A. What Went Well
*   **Decoupled Architecture:** Separating the frontend (Vercel) from the backend API (Render) allowed independent deployments, faster builds, and isolated troubleshooting.
*   **TypeScript & FastAPI Schemas:** Emphasizing Pydantic schemas in the backend and TypeScript types in the frontend minimized run-time data mismatch errors.
*   **Database Isolation in Tests:** Decoupling testing from the production database using an in-memory SQLite setup allowed us to run the test suite instantly without network latency.

### B. Challenges Faced
*   **Pydantic v2 Migration:** Upgrading dependencies introduced breaking changes in serialization. Raw SQLAlchemy model instances returned empty dictionaries (`{}`) when passed directly to `jsonable_encoder`. This was resolved by using Pydantic's `model_validate` and `model_dump(mode="json")` schemas.
*   **Security Credentials Checks:** During Git push operations, GitHub's Push Protection system blocked commits containing the database password. This required us to restructure configurations to run entirely off environment variables and rewrite history to clean up past commits.

### C. Key Lessons Learned & Future Improvements
*   **Environment Parity:** Always configure environment variables early. Setting up environment variables in both staging and local environments from day one prevents "works on my machine" issues.
*   **End-to-End Testing:** While pytest covered the API backend, future iterations should include automated E2E tests (using Playwright or Cypress) to simulate complete user flows in the browser.
*   **Continuous Integration (CI):** Setting up GitHub Actions to automatically run the test suite (`pytest`) on every pull request will verify stability before triggering Render deployments.
