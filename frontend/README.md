# ⚛️ HomeNest Frontend - React & TypeScript Application

Welcome to the frontend codebase for **HomeNest**, a modern, secure, and responsive household management platform. This project is built using **React 19**, **TypeScript**, **Vite**, and styled with **Tailwind CSS**.

---

## 🎨 Design Philosophy & UX
HomeNest features a premium, modern user interface following **glassmorphic design principles**. It utilizes a dark/sleek theme with high-contrast elements, custom icons, and fluid micro-animations to create a premium and engaging user experience. The layout is fully responsive, optimized for desktop, tablet, and mobile screens.

---

## 🗺️ Key Views & Page Structure

The application features three main views/pages, all seamlessly integrated with a sidebar navigation system:

### 1. 🏠 Landing & Authentication Page (`/login`, `/register`)
*   **Purpose:** The entry point for the user.
*   **Features:**
    *   Dynamic brand hero section with tagline and overview.
    *   Clean, responsive forms for both sign-in and sign-up.
    *   Real-time form validation with inline error messages (powered by Zod).
    *   Loading spinner states on submit buttons to prevent double-submissions.

### 2. 📊 User Dashboard (`/dashboard`)
*   **Purpose:** The central command center of the household.
*   **Features:**
    *   **Metrics Grid:** Summary cards for active groceries, monthly expenses, pending bills, and active reminders.
    *   **Notification Alert Feed:** Alerts categorized by priority (e.g. overdue bills, high-priority reminders).
    *   **Upcoming Bills:** Quick list of upcoming financial deadlines with calculated due dates.
    *   **Recent Activity:** A real-time audit trail of actions taken by family members (e.g. "Logged expense 'Milk'").

### 3. ⚙️ Module Detail Views
*   **Groceries Checklist (`/groceries`):** A list manager with category filters, quantity selectors, unit dropdowns, and interactive checkoff actions.
*   **Expenses Tracker (`/expenses`):** Financial dashboard showing daily/weekly/monthly totals, spending charts, and a transaction log.
*   **Bills Scheduler (`/bills`):** An interactive calendar and list view for monthly recurring utilities, showing statuses: **Paid**, **Unpaid**, or **Overdue**.
*   **Reminders Manager (`/reminders`):** Scheduling tool with priority tags (High, Medium, Low) and quick toggle completion status.
*   **Family Directory (`/family`):** Emergency contact book containing blood groups, birthdays, relationship statuses, and click-to-dial numbers.
*   **Document Vault (`/documents`):** File explorer with drag-and-drop file upload, file categorizations, and modal image/PDF previewers.

---

## 🏗️ Architecture & Design Patterns

*   **Component-Driven Architecture:** UI elements (Buttons, Input Fields, Cards, Modals, Skeletons) are built as reusable, isolated functional components.
*   **State Management (React Context):** Auth state (`AuthContext`) is handled globally, exposing the user profile, login status, and JWT tokens to the entire application.
*   **Route Guards (Private Routes):** Protected routes are wrapped in an `AuthGuard` component. If a user attempts to access `/dashboard` without a token, they are automatically redirected to `/login`.
*   **API Layer (Axios Interceptors):** Custom Axios instance with interceptors automatically reads the JWT from `localStorage` and appends it to the `Authorization` header on every request.
*   **Form Handling & Validation:** Built using **React Hook Form** coupled with **Zod Schemas** for schema-level validation, ensuring clean and robust client-side validation.

---

## 🛠️ Main Libraries & Dependencies

| Library | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Core UI library |
| **React Router DOM** | `^7.1.0` | Client-side routing and page navigation |
| **React Hook Form** | `^7.80.0` | Performance-optimized form handling |
| **Zod** | `^4.4.0` | Schema-based validation |
| **Axios** | `^1.18.0` | HTTP client for backend REST calls |
| **React Icons** | `^5.7.0` | Premium, modern SVG icon library |
| **React Hot Toast** | `^2.6.0` | Elegant, non-blocking toast notifications |
| **Tailwind CSS** | `^4.3.0` | Utility-first styling framework |

---

## 🚀 Running the Frontend Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Steps:
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the `frontend` root directory and set the backend API URL:
    ```env
    VITE_API_URL=http://localhost:8000
    ```
4.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
5.  **Open the application:**
    Open [http://localhost:5173](http://localhost:5173) in your browser.
