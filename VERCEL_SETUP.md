# 🚀 Vercel Deployment - Complete Setup Guide

## ⚠️ CRITICAL: Set Root Directory

**You MUST set the Root Directory in Vercel Dashboard before deploying:**

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Sign in to your account

2. **Create/Select Project:**
   - Click **"Add New Project"** (or select existing project)
   - Import from GitHub: `Saneha-Kanwal/ai_desk`
   - Select branch: `001-complete-ai-desk`

3. **Configure Project Settings:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** ⚠️ **SET THIS TO:** `frontend` (MOST IMPORTANT!)
   - **Build Command:** (leave default - `npm run build`)
   - **Output Directory:** (leave default - `.next`)
   - **Install Command:** (leave default - `npm install`)
   
   **OR** if Root Directory doesn't work, use these custom commands:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/.next`
   - **Install Command:** `cd frontend && npm install`

4. **Set Root Directory:**
   - Scroll down to **"Root Directory"** field
   - Click **"Edit"** or the field
   - Type: `frontend`
   - Click **"Save"** or **"Continue"**

5. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
   Replace with your actual backend URL.

6. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete

## ✅ Verification

After deployment, check:
- ✅ Build completes without errors
- ✅ Next.js version is detected (should show "Next.js 14.0.4")
- ✅ Site is accessible at your Vercel URL

## 🔧 If Still Getting Errors

### Error: "Module not found: Can't resolve '@/lib/auth'" or "Can't resolve 'date-fns'"

**This means Vercel is building from the root directory instead of `frontend/`.**

**Solution:**
1. Go to **Settings** → **General** → **Root Directory**
2. Set it to: `frontend` (exactly, case-sensitive, no leading slash)
3. Click **Save**
4. Go to **Deployments** tab
5. Click **Redeploy** on latest deployment

The `vercel.json` file has been added to help, but **Root Directory MUST be set to `frontend`** in Vercel Dashboard.

### Error: "Could not identify Next.js version"

**Solution:**
1. Go to **Settings** → **General** → **Root Directory**
2. Verify it's set to: `frontend` (not empty, not `/frontend`, just `frontend`)
3. Click **Save**
4. Go to **Deployments** tab
5. Click **Redeploy** on latest deployment

### Error: "No Next.js version detected"

**Check:**
1. Root Directory is exactly: `frontend` (case-sensitive)
2. `frontend/package.json` exists and has `"next": "14.0.4"` in dependencies
3. No typos in Root Directory setting

### Still Not Working?

**Alternative Approach:**
1. In Vercel Dashboard → **Settings** → **General**
2. Scroll to **"Root Directory"**
3. Delete any value (leave empty)
4. Save
5. Then set it again to: `frontend`
6. Save
7. Redeploy

## 📝 Important Notes

- **Root Directory MUST be set to `frontend`** - This is the most important step
- The root `package.json` now includes Next.js as a dependency (fallback)
- But Vercel should use `frontend/package.json` when Root Directory is set correctly
- Environment variables must be set in Vercel Dashboard → Settings → Environment Variables

## 🎯 Quick Checklist

- [ ] Root Directory set to `frontend` in Vercel Dashboard
- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set
- [ ] Project is connected to GitHub repository
- [ ] Branch `001-complete-ai-desk` is selected
- [ ] Build command is default (`npm run build`)
- [ ] Output directory is default (`.next`)

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

