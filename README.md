# CivicLens - Janta Ko Awaj

CivicLens is a civic engagement platform that allows citizens to voice their concerns and vote on community issues. The platform features user authentication, idea submission, and a voting system to highlight the most important community concerns.

## Features

- User authentication (login/signup) with guest access
- Submit civic concerns and ideas
- Upvote/downvote system for community feedback
- Top concerns dashboard
- Responsive web interface

## Tech Stack

**Backend:**
- Flask (Python web framework)
- SQLAlchemy (Database ORM)
- SQLite (Database)
- Flask-CORS (Cross-origin resource sharing)

**Frontend:**
- React 19
- Vite (Build tool)
- Modern CSS styling

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv .venv`
3. Activate virtual environment: `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `python run.py`

The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

The frontend will run on `http://localhost:5173`

## Usage

1. Start both backend and frontend servers
2. Open your browser to the frontend URL
3. Sign up for an account or continue as guest
4. Submit your civic concerns
5. Vote on existing concerns to prioritize community issues