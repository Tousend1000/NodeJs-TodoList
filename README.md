# To-Do List Web Application

## Overview
This is a full-stack **To-Do List application** built with **Node.js**, **Express.js**, **PostgreSQL**, and **vanilla JavaScript**. It allows users to manage tasks, including creating, editing, deleting, and filtering them. The application provides an intuitive frontend interface and a RESTful backend API.

![Screenshot of the Website](https://i.imgur.com/PVOIrZU.png)
![Screenshot of the task side menu](https://i.imgur.com/UTWLDqy.png)
![Screenshot of the filter menu](https://i.imgur.com/na3ixL1.png)

---

## Functionalities

### Task Management
- **Task Creation:** Create a new task with a title, description, priority, and optional due date.
- **Edit Task:** Cycle a task’s status between "To Do", "In Progress", and "Completed".
- **Delete Task:** Remove a task from the system.

### Task Display
- **Search:** Filter tasks by title or description using a search bar.
- **Filter:** Multi-select dropdowns to filter tasks by **priority** and **status**.
- **Sort:** Sort tasks by priority, status, or title (ascending or descending).
- **Overdue Detection:** Tasks with a past due date are visually marked as overdue.

### UI Features
- Dynamic task cards showing **priority**, **status**, **title**, **description**, and **due date**.
- **Popups** for adding new tasks or applying filters.
- Interactive buttons for editing and deleting tasks.

---

## How It Works

### Backend
- **Express.js API**
  - `POST /api/v1/tasks/` – create a new task
  - `PUT /api/v1/tasks/:id` – update task status or details
  - `DELETE /api/v1/tasks/:id` – delete a task
- **Database:** PostgreSQL with a `tasks` table.
- **Task Cache:** In-memory cache (`Map`) for faster retrieval and frontend updates.
- **Runs on Docker:** Uses docker to run the PostgreSQL database and the express.js API.

### Frontend
- Vanilla JavaScript handles:
  - Dynamic DOM updates
  - Search and filter logic
  - Task status cycling
  - Popups and form submissions
- HTML structure uses **task cards** and semantic tags for clarity.
- CSS for styling, including priority/status indicators, overlays, and popups.

---

## Technologies & Modules Used
- **Backend**
  - Node.js
  - Express.js
  - pg (PostgreSQL driver)
- **Frontend**
  - HTML5, CSS3
  - Vanilla JavaScript
  - FontAwesome icons
- **Utilities**
  - `fetch` API for AJAX calls
  - DOM manipulation and event listeners
- **Development**
  - EJS templating for rendering server-side data
  - Date handling with native `Date` object

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone git@github.com:Tousend1000/NodeJs-TodoList.git
   cd ToDoList
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure PostgreSQL using docker**
   ```bash
   docker pull postgres:16  # Pull the docker image
   docker compose up -d     # Start docker in detached mode
   ```
   The docker will automatically create the database and run it on **localhost:5432**
4. **Run the application**
   ```bash
   npm run start
   ```
5. **Open in browser**
   Navigate to `http://localhost:3000` (or your configured port).
