# SmartSeason Field Monitoring System

A web application for tracking crop progress across multiple fields during a growing season.

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
2. Install dependencies:
```
pip install -r requirements.txt
```
3. Create a `.env` file in `backend/config` with:
```
SECRET_KEY=secret
DEBUG=True
DB_NAME=postgres
DB_USER=db-user
DB_PASSWORD=db-pass
DB_HOST=your-db-host
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
- **Agent:** agent1 / Agent123!

## Design Decisions
- Used DRF Token Authentication — simple and sufficient for a two-role system
- Field status is computed dynamically from the data, not stored in the database
- Status logic: `Harvested` = Completed, `Growing` + older than 90 days = At Risk, everything else = Active

## Assumptions
- Only admins can create fields and assign them to agents since they are coordinators
- Agents only see fields assigned to them — they have no visibility into other agents' fields
- When an agent submits an update, the field's current stage is automatically updated to match