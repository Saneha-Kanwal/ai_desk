# Vercel Deployment Guide - Step by Step

## ✅ Pre-Deployment Checklist

### 1. **Set Root Directory in Vercel Dashboard** (CRITICAL)

**This is the MOST IMPORTANT step:**

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **General**
4. Scroll down to **Root Directory**
5. Click **Edit**
6. Set Root Directory to: `frontend`
7. Click **Save**

**Without this step, Vercel will look for `package.json` in the root directory and fail to detect Next.js.**

### 2. **Environment Variables**

Go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

**Important:** Replace `your-backend-url.vercel.app` with your actual backend URL.

If your backend is deployed separately, use that URL. If not deployed yet, you can:
- Deploy backend on Railway, Render, or another platform
- Or use `http://localhost:8000` for local development (won't work in production)

### 3. **Deploy**

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push to your GitHub branch (if connected)

## 🚀 Quick Deploy Steps

1. **Connect Repository:**
   - Go to Vercel Dashboard
   - Click **Add New Project**
   - Import your GitHub repository: `Saneha-Kanwal/ai_desk`
   - Select branch: `001-complete-ai-desk`

2. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `frontend` ⚠️ **SET THIS!**
   - **Build Command:** (leave default)
   - **Output Directory:** (leave default)
   - **Install Command:** (leave default)

3. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

4. **Deploy:**
   - Click **Deploy**
   - Wait for build to complete
   - Your site will be live!

## 🔧 Troubleshooting

### Error: "Could not identify Next.js version"

**Solution:** Set Root Directory to `frontend` in Vercel dashboard settings.

### Error: "No Next.js version detected"

**Solution:** 
1. Verify Root Directory is set to `frontend`
2. Check that `frontend/package.json` exists and has `next` in dependencies
3. Redeploy

### Build Fails

**Check:**
1. Root Directory is set to `frontend`
2. All dependencies are in `frontend/package.json`
3. No TypeScript errors (run `npm run build` locally first)
4. Environment variables are set correctly

### API Calls Fail

**Check:**
1. `NEXT_PUBLIC_API_URL` environment variable is set
2. Backend is deployed and accessible
3. CORS is configured on backend to allow your Vercel domain

## 📝 Notes

- The `vercel.json` file is in the `frontend/` directory
- Root `package.json` is for local development only
- Always set Root Directory to `frontend` in Vercel dashboard
- Backend must be deployed separately (FastAPI)

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

