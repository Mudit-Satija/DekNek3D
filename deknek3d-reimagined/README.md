# Deknek3D Reimagined

Full-stack 3D model sharing platform.

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB Atlas
- File hosting: Cloudinary

## Monorepo Structure

- `frontend/` React app (deploy to Vercel)
- `backend/` Express API (deploy to Render)

## Local Setup

### 1) Install dependencies

```bash
npm --prefix backend install
npm --prefix frontend install
```

### 2) Configure environment variables

Backend (`backend/.env`):

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173
MAX_UPLOAD_FILE_MB=25
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000
VITE_MAX_UPLOAD_FILE_MB=25
```

### 3) Run locally

```bash
npm --prefix backend run dev
npm --prefix frontend run dev -- --host 0.0.0.0
```

## Deployment Recommendation

Do not deploy this exact full stack as a single Vercel project.

Recommended production split:

1. Frontend on Vercel
2. Backend on Render

Why:

- This backend is a long-running Express server with multer upload flow.
- Render is better suited for persistent Node web services.
- Vercel is excellent for static/frontend hosting.

## Deploy Frontend to Vercel

1. Import repo in Vercel.
2. Set project root to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env vars:
	- `VITE_API_URL=https://your-backend.onrender.com`
	- `VITE_MAX_UPLOAD_FILE_MB=25`

## Deploy Backend to Render

This repo includes `render.yaml`.

1. Create a new Render Blueprint from this repo.
2. Set environment variables in Render dashboard:
	- `MONGODB_URI`
	- `JWT_SECRET`
	- `CLIENT_URLS=https://your-frontend.vercel.app,http://localhost:5173`
	- `CLOUDINARY_CLOUD_NAME`
	- `CLOUDINARY_API_KEY`
	- `CLOUDINARY_API_SECRET`
	- `MAX_UPLOAD_FILE_MB` (for example `20` or `25`)

## GitHub Push Checklist

- Ensure `.env` files are not committed.
- Commit `.env.example` files only.
- If you ever exposed real credentials publicly, rotate them immediately:
  - MongoDB user password
  - JWT secret
  - Cloudinary API secrets

## Build Verification

```bash
npm --prefix frontend run build
```
