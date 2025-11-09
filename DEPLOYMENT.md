# 🚀 Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier works great!)
- Git installed on your machine

## Step 1: Push to GitHub

Your code is ready to push! Run this command:

```bash
git push -u origin main
```

**Note**: If this is your first push to a new repository, you may need to:
1. Create the repository on GitHub first at: https://github.com/DD4universe/core-innovation-ch
2. Make sure the repository exists before pushing

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your `core-innovation-ch` repository

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build completion
   - Your site will be live at: `https://core-innovation-ch.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## 🎉 Post-Deployment

Once deployed, your site will feature:
- ✨ Ultra-smooth animations
- 🎨 Dynamic particle system
- 🖱️ Custom animated cursor
- 📱 Fully responsive design
- ⚡ Lightning-fast performance
- 🔄 Automatic deployments on every git push

## Testing Locally

Before deployment, test your site locally:

```bash
# Development mode
npm run dev

# Production build test
npm run build
npm start
```

Visit `http://localhost:3000` to see your site.

## Automatic Deployments

After initial setup, Vercel will automatically:
- Deploy every push to `main` branch to production
- Create preview deployments for pull requests
- Provide unique URLs for each deployment

## Environment Variables (if needed)

If you add any API keys or secrets:
1. Go to Project Settings → Environment Variables in Vercel
2. Add your variables
3. Redeploy for changes to take effect

## Troubleshooting

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Git push rejected
- Create the repository on GitHub first
- Ensure you have push permissions
- Check remote URL: `git remote -v`

### Port already in use locally
- Change port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## Performance Optimization

Your site is already optimized with:
- Next.js automatic code splitting
- Image optimization
- CSS/JS minification
- Gzip compression
- CDN delivery via Vercel Edge Network

## Support

If you encounter any issues:
- Check Vercel documentation: https://vercel.com/docs
- Review Next.js docs: https://nextjs.org/docs
- Check build logs for specific error messages

---

**Your website is now ready to impress the world! 🌟**
