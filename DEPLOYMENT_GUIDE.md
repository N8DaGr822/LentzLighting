# Deployment Guide for LentzLighting

## ⚠️ Important: GitHub Pages Limitation

**GitHub Pages only hosts static websites** (HTML, CSS, JavaScript). Your application is a **Blazor Server** app, which requires a .NET server to run. Therefore, it **cannot be deployed directly to GitHub Pages**.

## Deployment Options

### Option 1: Deploy to .NET Hosting Service (Recommended)

#### Azure App Service (Free Tier Available)

1. **Create Azure Account**
   - Go to https://azure.microsoft.com/free/
   - Sign up for free account (includes $200 credit)

2. **Create App Service**
   - Go to Azure Portal → Create Resource → Web App
   - Choose:
     - Runtime: .NET 9.0
     - OS: Windows (or Linux)
     - Plan: Free (F1) tier

3. **Deploy from GitHub**
   - In Azure Portal → Deployment Center
   - Connect your GitHub repository
   - Select branch: `main`
   - Azure will auto-deploy on every push

4. **Configure Database**
   - Add Azure SQL Database (or use LocalDB for testing)
   - Update connection string in Azure App Settings

5. **Set Environment Variables**
   - In Azure Portal → Configuration → Application Settings
   - Add connection string: `DefaultConnection`

**Cost:** Free tier available, then ~$13/month for basic hosting

---

#### Railway (Easy & Fast)

1. **Sign up at Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `LentzLighting` repository

3. **Configure Build**
   - Railway auto-detects .NET projects
   - Add build command: `dotnet publish -c Release -o ./publish`
   - Start command: `dotnet LentzLighting.dll`

4. **Add Database**
   - Click "New" → "Database" → "PostgreSQL" (or MySQL)
   - Update connection string in appsettings

5. **Deploy**
   - Railway automatically deploys on git push

**Cost:** $5/month for hobby plan, includes database

---

#### Fly.io (Free Tier)

1. **Install Fly CLI**
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Sign up**
   ```bash
   fly auth signup
   ```

3. **Initialize Fly**
   ```bash
   fly launch
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

**Cost:** Free tier available, pay-as-you-go

---

### Option 2: Convert to Blazor WebAssembly (For GitHub Pages)

If you want to use GitHub Pages, you need to convert your app to **Blazor WebAssembly**, which runs entirely in the browser.

**⚠️ Major Changes Required:**
- Convert from Blazor Server to Blazor WebAssembly
- Move all server-side code to API endpoints
- Update authentication to work client-side
- Database access must go through API

**Steps:**
1. Create new Blazor WebAssembly project
2. Move components to new project
3. Create Web API for database operations
4. Update authentication
5. Build and publish static files
6. Deploy to GitHub Pages

**This is a significant refactor and not recommended unless you specifically need GitHub Pages.**

---

## Quick Start: Railway Deployment

### Step-by-Step:

1. **Go to Railway**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `LentzLighting`

3. **Add Database**
   - In your project, click "New" → "Database" → "PostgreSQL"
   - Railway will provide connection string

4. **Update Connection String**
   - In Railway project → Variables
   - Add: `ConnectionStrings__DefaultConnection` = (your PostgreSQL connection string)

5. **Deploy**
   - Railway will auto-detect .NET and deploy
   - Your app will be live at: `https://your-app-name.railway.app`

6. **Update Database**
   - Connect to your Railway database
   - Run migrations: `dotnet ef database update`

---

## Environment Variables to Set

When deploying, make sure to set these in your hosting platform:

```
ConnectionStrings__DefaultConnection=<your-database-connection-string>
ASPNETCORE_ENVIRONMENT=Production
```

---

## Recommended: Azure App Service

For production use, Azure App Service is the most reliable option:

1. **Free tier** available for testing
2. **Easy GitHub integration** - auto-deploys on push
3. **Built-in SQL Database** support
4. **SSL certificates** included
5. **Scales easily** as you grow

---

## Need Help?

- **Azure**: https://docs.microsoft.com/azure/app-service/
- **Railway**: https://docs.railway.app/
- **Fly.io**: https://fly.io/docs/

---

## Current Status

✅ Code is pushed to GitHub: `https://github.com/N8DaGr822/LentzLighting`

❌ Cannot deploy to GitHub Pages (requires server)

✅ Ready to deploy to any .NET hosting service
