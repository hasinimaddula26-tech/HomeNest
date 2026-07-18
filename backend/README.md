# 🐍 HomeNest Backend - FastAPI REST API & Database Service

Welcome to the backend service for **HomeNest**, a production-ready, secure RESTful API built using **FastAPI**, **SQLAlchemy ORM**, and **MySQL**. This backend manages authentication, business logic, data persistence, and file storage for the HomeNest platform.

---

## 🛠️ Technology Stack & Architecture
*   **Framework:** FastAPI (ASGI) for high-performance, asynchronous routing and automatic OpenAPI documentation.
*   **ORM:** SQLAlchemy 2.x for object-relational mapping, transaction management, and protection against SQL injection.
*   **Database:** MySQL (relational database), providing normalized schemas and foreign key constraints.
*   **Authentication:** JWT (JSON Web Tokens) with a stateless authentication middleware.
*   **Password Security:** Bcrypt hashing algorithm via `passlib`.
*   **Validation:** Pydantic v2 for robust input/output schemas and automatic validation error handling.

---

## 🚀 Setup & Execution Instructions

### Prerequisites
*   Python 3.11+
*   MySQL Server (or an online instance like Aiven MySQL)

### Step-by-Step Local Run:
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend/` directory:
    ```env
    DATABASE_URL=mysql+pymysql://user:password@localhost:3306/homenest
    SECRET_KEY=yoursecretkeyhere
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```
5.  **Run the application server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The server will start on [http://localhost:8000](http://localhost:8000). Interactive Swagger documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🗄️ Database Schema & Entities

The database contains 7 normalized tables:
*   `users`: Store user credentials (hashed passwords).
*   `groceries`: Shopping items mapped to `user_id` with completion status.
*   `expenses`: Daily expenses mapped to `user_id` with categories and amounts.
*   `bills`: Recurring utility schedules with due dates and payment status.
*   `reminders`: Personal notifications with priority levels.
*   `family_members`: Household profiles and emergency contacts.
*   `documents`: Metadata of uploaded files securely stored on the server.
*   `activities`: Audit trail logs tracking user actions.

---

## 🔌 API Endpoint Documentation

All non-auth routes require a valid JWT token sent in the `Authorization: Bearer <JWT_TOKEN>` header.

### 1. Authentication (`/api/auth`)
*   **POST `/api/auth/register`**
    *   **Description:** Register a new user.
    *   **Request Body:**
        ```json
        { "username": "jane_doe", "password": "securepassword123" }
        ```
    *   **Response (200 OK):**
        ```json
        { "id": 1, "username": "jane_doe", "message": "User registered successfully" }
        ```

*   **POST `/api/auth/login`**
    *   **Description:** Log in to get a JWT token.
    *   **Request Body:**
        ```json
        { "username": "jane_doe", "password": "securepassword123" }
        ```
    *   **Response (200 OK):**
        ```json
        { "access_token": "eyJhbGciOi...", "token_type": "bearer" }
        ```

### 2. Groceries Checklist (`/api/groceries`)
*   **GET `/api/groceries`**
    *   **Description:** List all grocery items for the logged-in user.
    *   **Response (200 OK):**
        ```json
        [
          { "id": 5, "name": "Milk", "quantity": 2.0, "unit": "liters", "category": "Dairy", "completed": false }
        ]
        ```

*   **POST `/api/groceries`**
    *   **Description:** Add a grocery item.
    *   **Request Body:**
        ```json
        { "name": "Apples", "quantity": 1.5, "unit": "kg", "category": "Fruits" }
        ```
    *   **Response (201 Created):**
        ```json
        { "id": 6, "name": "Apples", "quantity": 1.5, "unit": "kg", "category": "Fruits", "completed": false }
        ```

*   **PUT `/api/groceries/{id}`**
    *   **Description:** Toggle `completed` status or edit details.
    *   **Request Body:**
        ```json
        { "completed": true }
        ```
    *   **Response (200 OK):**
        ```json
        { "id": 6, "name": "Apples", "completed": true }
        ```

*   **DELETE `/api/groceries/{id}`**
    *   **Description:** Delete a grocery item.
    *   **Response (200 OK):**
        ```json
        { "success": true, "message": "Item deleted" }
        ```

### 3. Expense Tracker (`/api/expenses`)
*   **GET `/api/expenses`**
    *   **Description:** Fetch all logged expenses.
    *   **Response (200 OK):**
        ```json
        [
          { "id": 12, "title": "Internet Bill", "amount": 999.00, "category": "Bills", "date": "2026-07-10" }
        ]
        ```

*   **POST `/api/expenses`**
    *   **Description:** Log a new expense.
    *   **Request Body:**
        ```json
        { "title": "Groceries", "amount": 1540.50, "category": "Food", "date": "2026-07-10" }
        ```
    *   **Response (201 Created):**
        ```json
        { "id": 13, "title": "Groceries", "amount": 1540.50, "category": "Food", "date": "2026-07-10" }
        ```

*   **GET `/api/expenses/summary`**
    *   **Description:** Fetch aggregated daily, weekly, and monthly totals.
    *   **Response (200 OK):**
        ```json
        { "today": 1540.50, "weekly": 2539.50, "monthly": 10540.00 }
        ```

### 4. Bills Schedule (`/api/bills`)
*   **GET `/api/bills`**
    *   **Description:** Get all recurring bills.
    *   **Response (200 OK):**
        ```json
        [
          { "id": 3, "title": "Electricity", "amount": 4200.00, "due_date": "2026-07-25", "paid": false }
        ]
        ```

*   **POST `/api/bills`**
    *   **Description:** Add a bill schedule.
    *   **Request Body:**
        ```json
        { "title": "Gas", "amount": 850.00, "due_date": "2026-07-20" }
        ```
    *   **Response (201 Created):**
        ```json
        { "id": 4, "title": "Gas", "amount": 850.00, "due_date": "2026-07-20", "paid": false }
        ```

*   **PUT `/api/bills/{id}`**
    *   **Description:** Mark a bill as paid.
    *   **Request Body:**
        ```json
        { "paid": true }
        ```
    *   **Response (200 OK):**
        ```json
        { "id": 4, "title": "Gas", "paid": true }
        ```

### 5. Document Vault (`/api/documents`)
*   **POST `/api/documents/upload`**
    *   **Description:** Upload a PDF or image file.
    *   **Request Form-Data:**
        *   `file`: (Binary File)
        *   `category`: "Medical" | "Identity" | "Financial" | "Others"
    *   **Response (201 Created):**
        ```json
        { "id": 1, "file_name": "passport.pdf", "file_type": "application/pdf", "category": "Identity" }
        ```

*   **GET `/api/documents/{id}/file`**
    *   **Description:** Retrieve and stream the physical file.
    *   **Response (200 OK):** File binary stream.

---

## 🔒 Security & Exception Handling
1.  **SQL Injection Protection:** Achieved by SQLAlchemy's automatic binding of variables in query compile phases.
2.  **User Data Isolation:** Enforced via dependency injection where `current_user` limits database queries to `.filter(Model.user_id == current_user.id)`.
3.  **Error Responses:** Standardized JSON error outputs:
    *   `401 Unauthorized` for missing/invalid JWT tokens.
    *   `404 Not Found` for invalid entity accesses.
    *   `422 Unprocessable Entity` for failing Pydantic validation checks.
