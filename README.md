# SmartSeason Field Monitoring System

A web application for tracking crop progress across multiple fields during a growing season.

## Live Demo
https://smartseason-field-monitoring-zjhd.onrender.com

## Tech Stack
- **Backend:** Django + Django REST Framework
- **Frontend:** React + Vite + Tailwind CSS
- **Database:** PostgreSQL (Supabase)

### Setup Instructions

### Backend
1. Navigate to the backend folder:
```
cd backend/config
```
2. Create and activate a virtual environment:
```
python -m venv venv
source venv/Scripts/activate
```
3. Install dependencies:
```
pip install -r requirements.txt
```
4. Create a `.env` file in `backend/config` with:
```
SECRET_KEY=secret
DEBUG=True
DB_NAME=postgres
DB_USER=db-user
DB_PASSWORD=db-pass
DB_HOST=db-host
DB_PORT=5432
```
4. Run migrations:
```
python manage.py migrate
```
5. Start the server:
```
python manage.py runserver
```
### Frontend
1. Navigate to the frontend folder:
```
cd frontend
```
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm run dev
```
## Demo Credentials
- **Admin:** admin / admin123
- **Agent1:** agent1 / Agent123!
- **Agent2:** agent2 / Agent123!

## Design Decisions
- Used DRF Token Authentication — simple and sufficient for a two-role system
- Field status is computed dynamically from the data, not stored in the database
- Status logic: `Harvested` = Completed, `Growing` + older than 90 days = At Risk, everything else = Active
- Admin dashboard includes bar chart (fields by stage) and donut chart (fields by status) for quick visual overview
- Agent management allows admins to create, edit and deactivate agents directly from the UI
- Agent profile page allows agents to view their own details including phone and location

## Assumptions
- Only admins can create fields and assign them to agents since they are coordinators
- Agents only see fields assigned to them — they have no visibility into other agents' fields
- When an agent submits an update, the field's current stage is automatically updated to match
- Deactivating an agent does not delete their data or unassign their fields
- An inactive agent cannot log in to the system