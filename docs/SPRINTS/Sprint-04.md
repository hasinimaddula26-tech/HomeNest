# Sprint 4: Database & Expense CRUD

## Goal
Design and implement the Expenses module vertically, enabling families to track budgets and monitor Today's, Weekly, Monthly, and Total expenditures from a centralized interface.

## Completed Features
- [x] **MySQL database structure**: Added `expenses` table scripts inside [schema.sql](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/database/schema.sql).
- [x] **SQLAlchemy representation**: Defined columns and types inside [expense.py](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/backend/app/models/expense.py).
- [x] **Pydantic schema validation**: Configured validators enforcing character lengths, non-numeric title checks, minimum decimal amounts (>= 0.01), and non-future date bounds.
- [x] **Service Layer summary Calculations**: Wrote queries inside [expense.py](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/backend/app/services/expense.py) to sum Today, Week, Month, and Total expenses.
- [x] **FastAPI endpoints**: Structured GET/POST/PUT/DELETE routes inside [expense.py](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/backend/app/routers/expense.py).
- [x] **Axios Service Layer**: Integrated API calls inside [expenseService.ts](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/frontend/src/services/api/expenseService.ts).
- [x] **Stateful form & list items**: Developed forms, list boxes, dynamic categories filter pills, search input fields, and sort dropdowns (Newest, Oldest, Highest, Lowest).
- [x] **Confirmation before deletion**: Implemented modal alerts.
- [x] **Page Assembler**: Wired all parts inside [index.tsx](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/frontend/src/pages/Expenses/index.tsx).

## Challenges
- Synchronous state updates inside effect hooks triggering ESLint `set-state-in-effect` errors.

## Solutions
- Wrapped mounting `fetchData` commands in a brief `setTimeout(..., 0)` with cleanups to defer execution to the next event loop tick.

## Next Sprint
- Sprint 5: Bills & Reminders CRUD modules.
