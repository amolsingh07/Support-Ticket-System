# 🧾 Support Ticket System — Tech Intern Assessment

## 📌 Project Summary

This project is a full-stack **Support Ticket System** built from scratch.

It allows users to:

* Submit support tickets
* Automatically categorize tickets using AI
* Track ticket status
* Filter/search tickets
* View system analytics
* Manage tickets (resolve, close, delete)

The entire system runs using **Docker** with one command.

Even someone non-technical can run the system by following the steps below.

---

# 🎯 Goal of the Assignment

The objective was to build a real-world production-style system that includes:

* Backend API
* Frontend UI
* AI (LLM) integration
* Database
* Docker containerization

This simulates how real companies build internal tools.

---

# 🧠 How the System Works (Simple Explanation)

Imagine a customer support system.

1. User writes a problem
2. AI reads the description
3. AI suggests:

   * Category (technical, billing, etc.)
   * Priority (low, high, critical)
4. User can accept or change suggestions
5. Ticket is saved
6. Team can update status
7. Dashboard shows stats

Everything updates live without refreshing the page.

---

# 🏗️ Tech Stack Used

## Backend

* Django
* Django REST Framework
* PostgreSQL database

Why Django?

* Fast API development
* Built-in admin panel
* Strong database support

---

## Frontend

* React (Vite)

Why React?

* Fast UI updates
* Component-based structure
* Industry standard

---

## AI / LLM

* Google Gemini API

Why LLM?
To automatically classify tickets based on description.

Example:

> "Payment failed while subscribing"
> AI suggests:
> Category → Billing
> Priority → High

User can override suggestions.

---

## Infrastructure

* Docker
* Docker Compose

Why Docker?
So reviewer can run everything with one command.

---

# 📦 System Architecture

```
User → React Frontend → Django API → PostgreSQL
                     ↘ AI API (Gemini)
```

---

# 🗄️ Database Model

Ticket fields:

| Field       | Purpose                                 |
| ----------- | --------------------------------------- |
| title       | short ticket title                      |
| description | full problem                            |
| category    | billing / technical / account / general |
| priority    | low / medium / high / critical          |
| status      | open / in_progress / resolved / closed  |
| created_at  | auto timestamp                          |

All constraints are enforced at the database level.

---

# 🔌 API Endpoints

### Create Ticket

POST `/api/tickets/`

Creates a new ticket.

---

### Get Tickets

GET `/api/tickets/`

Supports filters:

```
?category=technical
?priority=high
?status=open
?search=login
```

Filters can be combined.

---

### Update Ticket

PATCH `/api/tickets/<id>/`

Change:

* status
* category
* priority
* comment

---

### Delete Ticket

DELETE `/api/tickets/<id>/delete/`

Removes ticket.

---

### Stats Endpoint

GET `/api/tickets/stats/`

Returns:

```
total tickets
open tickets
avg per day
priority breakdown
category breakdown
```

Uses database aggregation (not Python loops).

---

### AI Classify Endpoint

POST `/api/tickets/classify/`

Input:

```
description
```

Output:

```
suggested_category
suggested_priority
```

Used by frontend before submission.

---

# 🤖 LLM Prompt Design

The AI receives:

```
You are a support ticket classifier.
Read the description and return JSON:
category: billing/technical/account/general
priority: low/medium/high/critical
```

Why this prompt?

* Structured output
* Reliable parsing
* Prevents random text

---

# ⚠️ Error Handling

If AI fails:

* Ticket still submits
* Default values used

This ensures reliability.

---

# 🎨 Frontend Features

### Submit Ticket

* Title input
* Description input
* AI auto-suggest
* Editable dropdowns
* Submit without page reload

---

### Ticket List

* Shows all tickets
* Resolve button
* Close with comment
* Delete button
* Filters
* Search

---

### Stats Dashboard

Shows:

* Total tickets
* Open tickets
* Avg/day
* Breakdown

Auto updates after new ticket.

---

# 🐳 Docker Setup

Everything runs with one command.

## Step 1 — Install Docker

Download:
https://www.docker.com/products/docker-desktop/

---

## Step 2 — Add API Key

Create `.env` file in project root:

```
GEMINI_API_KEY=your_key_here
```

Get key from:
https://makersuite.google.com/

---

## Step 3 — Run Project

```
docker-compose up --build
```

That's it.

---

# 🌐 App URLs

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:8000/api/tickets/
```

---

# 🔄 Automatic Startup

Docker automatically:

* starts database
* runs migrations
* starts backend
* starts frontend

No manual setup required.

---

# 🧪 Testing Flow

1. Open frontend
2. Write description
3. AI suggests category/priority
4. Submit ticket
5. Resolve ticket
6. Close ticket
7. Delete ticket
8. See stats update

Everything updates live.

---

# 🧱 Design Decisions

### Why Django instead of Node?

Faster to build APIs with strong ORM.

### Why PostgreSQL?

Reliable production database.

### Why React?

Best for dynamic UI.

### Why Docker?

One-command setup for reviewer.

### Why Gemini?

Free tier + fast classification.

---

# 📊 Evaluation Criteria Coverage

| Area              | Status |
| ----------------- | ------ |
| Docker works      | ✅      |
| LLM classify      | ✅      |
| Stats aggregation | ✅      |
| Filters/search    | ✅      |
| DB constraints    | ✅      |
| Frontend UI       | ✅      |
| Auto refresh      | ✅      |
| Env variables     | ✅      |
| README            | ✅      |

---

# 🚀 Future Improvements

If this were production:

* Authentication system
* User roles
* Email notifications
* WebSocket updates
* Ticket assignment
* File uploads

---

# 👨‍💻 Author Notes

This project was built to simulate a real production support tool.

Focus areas:

* clean architecture
* reliable API
* AI integration
* containerized deployment

---

# 🏁 Final Instructions for Reviewer

Run:

```
docker-compose up --build
```

Open:

```
http://localhost:5173
```

System should work fully end-to-end.

---

# 🙌 Thank You

Thank you for reviewing this submission.
