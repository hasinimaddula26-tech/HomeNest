# HomeNest – Project Explanation

Hey! Since we're doing this together, I wanted to explain the complete idea before we start coding.

The project is called **HomeNest**. It's basically a **Digital Home Management System**.

The problem we're trying to solve is that every family has important information scattered across different places. Grocery lists are in WhatsApp, bills are in emails, documents are in Google Drive, expenses are written in notebooks, and reminders are stored in different apps. Managing all these things becomes difficult.

So instead of using five or six different apps, we're building **one platform where a family can manage everything related to their home.**

---

# Imagine this situation

Suppose your mom says,

> "Can you check when the electricity bill is due?"

You start searching:

* WhatsApp
* Gallery
* Email
* Google Drive
* Notes

It wastes time.

Our application solves this.

Everything is available in one dashboard.

---

# Main Features

### 1. User Authentication

Every family creates an account.

They can:

* Register
* Login
* Securely access only their own data

---

### 2. Dashboard

This is the first screen after login.

It gives a quick overview like:

* Pending bills
* Monthly expenses
* Grocery items remaining
* Upcoming reminders
* Stored documents
* Family members

Instead of opening every module separately, users immediately know what's happening.

---

### 3. Grocery Management

Users can:

* Add grocery items
* Edit them
* Delete them
* Mark them as purchased

Example:
* Milk
* Rice
* Eggs
* Cooking Oil

This is a complete CRUD module.

---

### 4. Expense Tracker

Users record expenses like:
* Vegetables
* Electricity
* Shopping
* Medical
* Fuel

The dashboard will calculate:
* Today's Expense
* Weekly Expense
* Monthly Expense

Later we can even show charts.

---

### 5. Bills Module

Users can save recurring bills like:
* Electricity
* Water
* Internet
* Gas
* Mobile Recharge

Each bill has:
* Amount
* Due Date
* Status (Pending or Paid)

This prevents missing payments.

---

### 6. Reminder Module

Users can create reminders for:
* Medicine
* Insurance Renewal
* Birthdays
* EMIs
* Appointments
* Important Dates

---

### 7. Document Vault

Instead of searching everywhere, users upload important documents like:
* Aadhaar
* PAN
* Passport
* Driving License
* Property Documents
* Electricity Bills

They can download them anytime.

---

### 8. Emergency Contacts

Users can save:
* Doctor
* Police
* Hospital
* Electrician
* Plumber
* Nearby Contacts

Everything stays organized.

---

### 9. Family Members

Store details of family members:
* Name
* Phone
* Blood Group
* Birthday
* Email
* Relationship

---

# Technology Stack

**Frontend**
* React
* TypeScript
* Tailwind CSS
* Vite

**Backend**
* Python FastAPI

**Database**
* MySQL

**Deployment**
* Vercel (Frontend)
* Render (Backend)

---

# Why we selected FastAPI

Since both of us are learning full-stack development and Python is beginner-friendly, FastAPI lets us build APIs quickly.

It's also fast, modern, and used in many production applications.

---

# How the application works

```
User
  ↓
React Frontend
  ↓
REST API
  ↓
FastAPI Backend
  ↓
MySQL Database
```

Whenever the user clicks a button like **Add Expense**, the frontend sends a request to the backend, the backend stores the data in MySQL, and the updated information is shown back on the screen.

---

# How we're planning to build it

We are **not** going to build everything at once. We'll build it module by module.

* **Phase 1**: Project setup, folder structure, routing, landing page
* **Phase 2**: Login & Register
* **Phase 3**: Dashboard
* **Phase 4**: Grocery CRUD
* **Phase 5**: Expense CRUD
* **Phase 6**: Bills CRUD
* **Phase 7**: Reminders
* **Phase 8**: Documents
* **Phase 9**: Backend APIs
* **Phase 10**: Database Integration
* **Phase 11**: Deployment

---

# Division of Work

### My Part (Lead Developer & Backend Architect)
* Project architecture
* React routing
* Backend APIs (FastAPI)
* Database integration (MySQL)
* Authentication
* Deployment
* GitHub management

### Your Part (Co-Founder & UI/UX Engineer)
* UI implementation
* Responsive design
* Reusable React components
* Forms and validations
* Dashboard cards
* Testing and bug fixing
* Documentation and README

We'll review each other's code before merging it so both of us understand the entire project.

---

# Goal

We don't want this to look like a college assignment. We want it to feel like a real product that a family could actually use. Along the way, we'll learn React, TypeScript, Tailwind CSS, FastAPI, REST APIs, MySQL, authentication, CRUD operations, and deployment—all the core skills expected from a full-stack developer.
