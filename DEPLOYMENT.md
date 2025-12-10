# Deployment Guide

## Deploying on Vercel/Cursor

This project has a monorepo structure with the Next.js frontend in the `frontend/` directory.

### ⚠️ IMPORTANT: Configure Root Directory

**You MUST set the Root Directory in your deployment platform settings:**

1. Go to your project settings in Vercel/Cursor
2. Navigate to **Settings** → **General** → **Root Directory**
3. Set the Root Directory to: `frontend`
4. Click **Save**
5. Redeploy your project

**Without setting the Root Directory, the deployment platform will look for `package.json` in the root directory and won't find Next.js.**

### Alternative: If Root Directory Setting is Not Available

If your deployment platform doesn't support Root Directory settings, you can:

1. Deploy only the `frontend/` directory:
   - Clone the repo
   - Copy only the `frontend/` folder contents
   - Deploy that folder

2. Or use the root `package.json` scripts (already configured):
   - The root `package.json` has scripts that navigate to `frontend/`
   - But you still need to set Root Directory to `frontend` for this to work

### Environment Variables

Make sure to set these environment variables in your deployment platform:

```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_API_URL=https://your-backend-url.com
JWT_SECRET_KEY=your_secret_key_here_min_32_chars
```

### Backend Deployment

The backend (FastAPI) needs to be deployed separately. Options:
- Railway
- Render
- Heroku
- AWS/GCP/Azure
- DigitalOcean

Update `NEXT_PUBLIC_API_URL` in frontend environment variables to point to your deployed backend URL.

