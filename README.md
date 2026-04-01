# JobCompare App

A lightweight tool for comparing job offers using customizable scoring weights. Built with **Node.js**, **Express**, and **SQLite** for fast, simple local development.

---

## 🚀 Features
- Add job offers with detailed compensation fields  
- Store and update comparison weight settings  
- Auto‑creates database tables and default settings  
- Clean REST API for CRUD operations  

---

## 🗂 Project Structure
`backend/
db/
routes/
server.js`

---

## 🧰 Tech Stack
- Node.js + Express  
- SQLite  
- Thunder Client / Postman  
- Git + GitHub  

---

## 📦 Setup

```bash
git clone https://github.com/seattlefurby17/jobCompareApp.git
cd jobCompareApp/backend
npm install
npm start
Server runs at: http://localhost:4000
```

## 🔌 API Endpoints
POST /jobs — create a job

GET /jobs — list jobs (coming soon)

GET /settings — get weight settings (coming soon)

PUT /settings — update settings (coming soon)

## 🗄 Database
On first run, the backend:

Creates jobs and settings tables

Inserts default settings

🛠 Workflow
main holds stable code

New work goes on feature branches like:

feature/get-jobs

feature/settings

feature/compare-logic

## 📌 Roadmap
Finish CRUD routes

Add scoring logic

Build frontend

Optional: auth + deployment