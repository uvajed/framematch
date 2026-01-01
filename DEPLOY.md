# Deploying Shot Match to Railway

## Prerequisites
- GitHub account
- Railway account (https://railway.app)

## Step 1: Push to GitHub

```bash
cd /Users/elvis/Documents/Claude\ Code/Personal/shottool
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shottool.git
git push -u origin main
```

## Step 2: Deploy Backend

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your `shottool` repository
4. Click "Add Service" → "GitHub Repo" → select the repo again
5. For this service, set the **Root Directory** to `backend`
6. Railway will auto-detect the Dockerfile
7. Wait for deployment to complete
8. Click on the service → "Settings" → "Generate Domain"
9. Copy the generated URL (e.g., `https://shottool-backend-xxxx.railway.app`)

## Step 3: Deploy Frontend

1. In the same Railway project, click "New Service" → "GitHub Repo"
2. Select your `shottool` repository again
3. Set the **Root Directory** to `frontend`
4. Go to "Variables" tab and add:
   ```
   VITE_API_URL=https://shottool-backend-xxxx.railway.app
   ```
   (Use the backend URL from Step 2)
5. Railway will rebuild with the API URL baked in
6. Go to "Settings" → "Generate Domain"
7. Your app is live!

## Environment Variables

### Backend
No required environment variables.

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.railway.app` |

## Custom Domain (Optional)

1. Go to your service → "Settings" → "Domains"
2. Click "Custom Domain"
3. Add your domain and configure DNS as instructed

## Costs

- **Free tier**: $5/month credit (enough for light usage)
- **Pro**: $20/month for more resources and no sleep

## Troubleshooting

**Frontend can't reach backend?**
- Check VITE_API_URL is set correctly (no trailing slash)
- Ensure backend has a public domain generated

**Build fails?**
- Check the build logs in Railway dashboard
- Ensure Root Directory is set correctly (`backend` or `frontend`)
