# Sprint 5: Smart Household Management

## Goal
Establish a smart household management system integrating Bills, Reminders, and Activity Logs, complete with a modular dashboard service and visual timeline widgets.

## Completed Features
- [x] **MySQL Schema Updates**: Created `bills`, `reminders`, and `activities` tables inside [schema.sql](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/database/schema.sql).
- [x] **SQLAlchemy Models**: Implemented the models in `backend/app/models/`.
- [x] **Pydantic Validation**: Added computed field properties to calculate overdue bills dynamically in `backend/app/schemas/`.
- [x] **Service Layer Helpers**: Structured queries and activity loggers inside `backend/app/services/`.
- [x] **Router registrations**: Added routers to `backend/app/main.py`.
- [x] **Frontend Axios layers**: Wrote calls for bills, reminders, and dashboard widgets in `frontend/src/services/api/`.
- [x] **Navbar notification badge**: Configured a bell icon showing unread messages with priority colored dots.
- [x] **Timeline strip**: Developed [HorizontalCalendar.tsx](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/frontend/src/components/calendar/HorizontalCalendar.tsx) displaying event marker dots.
- [x] **Interactive pages**: Built [Bills index.tsx](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/frontend/src/pages/Bills/index.tsx) and [Reminders index.tsx](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/frontend/src/pages/Reminders/index.tsx).
- [x] **Unified Dashboard**: Redesigned [Dashboard index.tsx](file:///c:/Users/M.Hasini/OneDrive/Desktop/Digital%20Home%2520Hub/frontend/src/pages/Dashboard/index.tsx) to act as the app's central hub.

## Challenges
- TypeScript compile warnings from unused function declarations and generic type configurations in form hooks.

## Solutions
- Deleted unused functions and typed `useForm` hooks using `z.infer<typeof schema>` to maintain strict type safety.

## Next Sprint
- Sprint 6: Production Readiness (Authentication, Protected Routes, Documents Upload, Family Directory, and final polish).
