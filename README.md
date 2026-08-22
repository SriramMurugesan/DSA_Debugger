# MagizhCode - DSA Learning Platform

MagizhCode is a premium, data-driven learning platform designed for mastering Data Structures and Algorithms. It features a curated roadmap, an extensive problem database, and a fully interactive code visualizer.

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (Development) / PostgreSQL-ready
- **ORM**: SQLAlchemy
- **Authentication**: Custom OAuth 2.0 (Google & GitHub) with server-side HttpOnly session cookies (via `itsdangerous`)
- **Code Execution Engine**: Python `sys.settrace` based AST validation and execution router, capturing detailed runtime step-by-step state for visualization.
- **API**: RESTful architecture serving dynamic categories, problems, and user progress.

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Zustand (for execution state) & React Query (for API data caching and server state)
- **Styling**: Tailwind CSS with custom semantic CSS tokens (`--color-primary`, `--bg-elevated`, etc.) reflecting the MagizhCode brand (Warm Gold, Cream, Crimson, and Deep Charcoal).
- **Icons**: Lucide React

## Project Structure

- `backend/app/`: Contains the FastAPI application.
  - `api/routes/`: Endpoints for Auth, Dashboard, Problems, and Execution.
  - `core/`: Configurations and environment variables.
  - `db/`: SQLAlchemy models (`User`, `Category`, `Problem`, `UserProblemProgress`) and database connection.
  - `execution/`: Secure runner and AST tracing logic for Python execution.
  - `seed.py`: Utility to populate the database with 80+ DSA problems across 16 categories.

- `frontend/src/`: Contains the React application.
  - `components/`: Reusable UI elements (Navigation, Layout, Visualizers, Editor).
  - `pages/`: Route components (LandingPage, Dashboard, ProblemList, ProblemWorkspace, Roadmap).
  - `context/`: `AuthContext` managing frontend authentication state.
  - `store/`: Zustand stores (e.g., `executionStore`).
  - `services/`: API clients (e.g., `executionService`).

## Setup and Running Locally

### Backend Setup
1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install pydantic-settings httpx itsdangerous aiofiles
   ```
4. Initialize the database and seed the problems:
   ```bash
   python -m app.db.init_db
   python -m app.db.seed
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

### Local Authentication Testing
To test the application without configuring real Google/GitHub OAuth credentials:
1. Start both servers.
2. Navigate your browser to `http://localhost:8000/api/v1/auth/dev-login`.
3. You will be automatically authenticated with a developer session and redirected to the Dashboard.

## Features
- **Curated Learning Roadmap**: A visual zigzag tree roadmap grouping problems by algorithmic pattern (Arrays, Two Pointers, Trees, DP, etc.).
- **Interactive Problem Solving**: Dedicated workspace containing problem descriptions, constraints, and test cases.
- **Code Execution & Visualization**: Execute Python code directly in the browser and visualize data structures step-by-step.
- **Progress Tracking**: Track solved problems, current streaks, and category completion percentages.
- **Secure Authentication**: Proper OAuth flows with HttpOnly session persistence.