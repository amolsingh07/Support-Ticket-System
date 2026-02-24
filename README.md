# 📌 Project Summary

I built a full-stack **AI-powered Support Ticket System** from scratch to simulate a real-world internal tool used by support teams.

The system allows users to:

* Submit support tickets
* Get automatic AI-based categorization
* Track ticket status
* Filter and search tickets
* View analytics dashboard
* Manage ticket lifecycle (resolve, close, delete)

The entire application is containerized with **Docker**, so it can be run locally with a single command.

This project focuses on production-style architecture, not just UI.

---

# 🎯 Project Goal

My goal was to design and implement a realistic production-style system that includes:

* Backend API
* Frontend UI
* LLM integration
* Database design
* Dockerized deployment

The idea was to simulate how real companies build internal tools and ensure the project demonstrates backend depth, system design, and integration skills.

---

# 🧠 How the System Works

The flow is similar to a real customer support platform:

1. User submits a problem description
2. AI reads the text
3. AI suggests:

   * Category (billing, technical, etc.)
   * Priority (low → critical)
4. User can accept or override suggestions
5. Ticket is stored in the database
6. Support team updates status
7. Dashboard updates automatically

The UI updates in real time without page refresh.

---

# 🏗️ Tech Stack

## Backend

* Django
* Django REST Framework
* PostgreSQL

**Why Django**

* Fast API development
* Built-in admin panel
* Strong ORM and validation
* Production-ready structure

---

## Frontend

* React (Vite)

**Why React**

* Component-based architecture
* Fast rendering
* Industry standard for modern apps

---

## AI / LLM Integration

* Google Gemini API

Used for automatic ticket classification.

Example:

Input:

> "Payment failed while subscribing"

AI output:

* Category → Billing
* Priority → High

Users can override suggestions before submission.

---

## Infrastructure

* Docker
* Docker Compose

I containerized the entire system so reviewers can run it with one command and no manual setup.

---

# 📦 Architecture

```
User → React Frontend → Django API → PostgreSQL
                     ↘ Gemini API
```

The frontend calls the Django API.
The API calls Gemini for classification when needed.
All data is stored in PostgreSQL.

---

# 🗄️ Database Design

Ticket model includes:

| Field       | Description                             |
| ----------- | --------------------------------------- |
| title       | Short title                             |
| description | Full issue text                         |
| category    | billing / technical / account / general |
| priority    | low / medium / high / critical          |
| status      | open / in_progress / resolved / closed  |
| created_at  | timestamp                               |

Constraints and validation are enforced at the database level.

---

# 🔌 API Endpoints

### Create Ticket

`POST /api/tickets/`

Creates a new ticket.

---

### Get Tickets

`GET /api/tickets/`

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

`PATCH /api/tickets/<id>/`

Update:

* status
* category
* priority
* comment

---

### Delete Ticket

`DELETE /api/tickets/<id>/delete/`

Deletes ticket.

---

### Stats Endpoint

`GET /api/tickets/stats/`

Returns:

* total tickets
* open tickets
* avg tickets/day
* priority breakdown
* category breakdown

Uses database aggregation queries (not Python loops).

---

### AI Classification

`POST /api/tickets/classify/`

Input:

```
description
```

Output:

```
suggested_category
suggested_priority
```

Used by frontend before final submission.

---

# 🤖 LLM Prompt Design

The AI receives a structured prompt:

```
You are a support ticket classifier.
Return JSON:
category: billing/technical/account/general
priority: low/medium/high/critical
```

I designed the prompt to:

* enforce structured JSON output
* avoid random text
* make parsing reliable

---

# ⚠️ Error Handling

If AI fails:

* Ticket still submits
* Default values are used

This ensures reliability and prevents blocking users.

---

# 🎨 Frontend Features

### Ticket Submission

* Title + description inputs
* AI auto-suggest
* Editable category/priority
* Submit without page reload

---

### Ticket Dashboard

* Ticket list
* Filters
* Search
* Resolve button
* Close with comment
* Delete option

---

### Analytics Panel

Displays:

* Total tickets
* Open tickets
* Average/day
* Category breakdown
* Priority breakdown

Auto-updates after ticket changes.

---

# 🐳 Docker Setup

Everything runs with one command.

## 1. Install Docker

[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

## 2. Add API Key

Create `.env` in root:

```
GEMINI_API_KEY=your_key_here
```

## 3. Run

```
docker-compose up --build
```

Docker automatically:

* starts PostgreSQL
* runs migrations
* starts backend
* starts frontend

---

# 🌐 Local URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8000/api/tickets/
```

---

# 🧪 Test Flow

1. Open frontend
2. Submit ticket
3. AI suggests category/priority
4. Save ticket
5. Resolve or close
6. Delete ticket
7. View stats update

All updates happen live.

---

# 🧱 Key Design Decisions

**Django over Node**

* Faster API development
* Built-in admin
* Strong ORM

**PostgreSQL**

* Production-grade relational DB

**React**

* Dynamic UI
* Fast updates

**Docker**

* One-command setup for reviewers

**Gemini API**

* Fast classification
* Easy integration
* Free tier available

---

# 📊 Feature Coverage

| Feature              | Implemented |
| -------------------- | ----------- |
| Dockerized setup     | ✅           |
| AI classification    | ✅           |
| Stats aggregation    | ✅           |
| Filters/search       | ✅           |
| DB constraints       | ✅           |
| Frontend UI          | ✅           |
| Auto refresh         | ✅           |
| Env variables        | ✅           |
| Production structure | ✅           |

---

# 🚀 Future Improvements

Planned next steps if extended to production:

* Authentication & user roles
* Ticket assignment
* Email notifications
* WebSocket live updates
* File attachments
* Audit logs

---

# 👨‍💻 About This Project

I built this project to demonstrate:

* Backend system design
* Full-stack integration
* LLM usage in real apps
* Dockerized deployment
* Production-style architecture

This is intended to represent the level of complexity expected in real-world internal tools.

---

# 🏁 How to Run

```
docker-compose up --build
```

Open:

```
http://localhost:5173
```

The system should run end-to-end.

