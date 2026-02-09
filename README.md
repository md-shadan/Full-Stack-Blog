# Blog Website (Full Stack)

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Spring Boot (REST API) + Spring Security + JWT
- Database: MySQL

## Project Structure
- `frontend/`
- `backend/`

## Environment
Create a `.env` file from `.env.example` and adjust values.

## Backend Setup
1. Ensure MySQL is running and create database `blog_db` or use Docker.
2. From `backend/`:
   - `mvn spring-boot:run`
3. Swagger UI: `http://localhost:8080/swagger-ui.html`

## Frontend Setup
1. From `frontend/`:
   - `npm install`
   - `npm run dev`
2. App: `http://localhost:5173`

## Docker (Backend + MySQL)
From repo root:
- `docker compose up --build`

## Sample API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/posts?page=0&size=10&sort=latest&search=hello`
- `GET /api/posts/{id}`
- `POST /api/posts`
- `PUT /api/posts/{id}`
- `DELETE /api/posts/{id}`

## Notes
- JWT token is returned from login/register and used as `Authorization: Bearer <token>`.
- Role-based access: USER and ADMIN.
- Pagination/search/sort supported on the posts listing endpoint.
