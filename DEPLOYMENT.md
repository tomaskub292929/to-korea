# Gateway to Korea - Deployment Guide

## 🚀 Vercel Deployment with Firebase

This guide covers deploying your Next.js app to Vercel with Firebase backend.

---

## Prerequisites

- ✅ Firebase project created (`gateway-to-korea-dd4e6`)
- ✅ Firebase Authentication enabled (Email/Password)
- ✅ Firestore Database created
- ✅ Local development working (`npm run dev`)

---

## Option 1: Deploy via Vercel CLI (Recommended)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# First deployment (will ask configuration questions)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? gateway-to-korea
# - Directory? ./
# - Override settings? No
```

### 4. Set Environment Variables

After first deployment, set production environment variables:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste: AIzaSyDei4VGkazoTaxUkCtkKRAnigοUpJwWATo

vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# Paste: gateway-to-korea-dd4e6.firebaseapp.com

vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
# Paste: gateway-to-korea-dd4e6

vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
# Paste: gateway-to-korea-dd4e6.firebasestorage.app

vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
# Paste: 381576316539

vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
# Paste: 1:381576316539:web:68a5dac2176e655387c4de
```

**For each variable, select:**
- Environment: `Production`, `Preview`, `Development` (all three)

### 5. Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Option 2: Deploy via Vercel Dashboard

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Firebase authentication"
git push origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure Project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)

### 3. Add Environment Variables

In Vercel dashboard, before deploying:

**Settings → Environment Variables**

Add each variable for **Production, Preview, and Development**:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyDei4VGkazoTaxUkCtkKRAnigοUpJwWATo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = gateway-to-korea-dd4e6.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = gateway-to-korea-dd4e6
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = gateway-to-korea-dd4e6.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 381576316539
NEXT_PUBLIC_FIREBASE_APP_ID = 1:381576316539:web:68a5dac2176e655387c4de
```

### 4. Deploy

Click "Deploy" button.

---

## Firebase Configuration for Production

### 1. Add Production Domain to Firebase

After Vercel deployment, you'll get a domain like `gateway-to-korea.vercel.app`

**Firebase Console:**
```
Authentication → Settings → Authorized domains
→ Add domain: gateway-to-korea.vercel.app
```

### 2. Update Firestore Security Rules

Currently in test mode (expires soon). Update to production rules:

**Firebase Console → Firestore Database → Rules**

Replace temporary rules with production-ready rules from our implementation plan.

```bash
# Or deploy via CLI:
firebase deploy --only firestore:rules
```

### 3. Configure Email Templates

**Firebase Console → Authentication → Templates**

Customize:
- Email Verification template
- Password Reset template
- Update sender name and email

---

## 🔒 Security Best Practices

### Development vs Production Separation

**Recommended: Create separate Firebase projects**

1. **Development**: `gateway-to-korea-dd4e6` (current)
2. **Production**: `gateway-to-korea-prod` (new project)

**Benefits:**
- Separate test data from real users
- Different security rules
- Independent billing

**Setup:**

1. Create new Firebase project for production
2. Copy configuration
3. Add to Vercel as production-only env vars:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# Use production Firebase config

vercel env add NEXT_PUBLIC_FIREBASE_API_KEY preview
# Use development Firebase config
```

4. Update `src/lib/firebase.config.ts` to use different configs based on environment:

```typescript
const firebaseConfig = process.env.NODE_ENV === 'production'
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_PROD,
      // ... production config
    }
  : {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      // ... development config
    };
```

---

## Post-Deployment Checklist

### Immediate Actions

- [ ] Verify deployment URL works
- [ ] Test user registration
- [ ] Test email/password login
- [ ] Test email verification (check spam folder)
- [ ] Test password reset
- [ ] Check Firebase Console → Authentication → Users
- [ ] Check Firestore → users collection

### Security

- [ ] Add production domain to Firebase authorized domains
- [ ] Update Firestore security rules (remove test mode)
- [ ] Enable Firebase App Check (recommended)
- [ ] Set up monitoring and alerts

### Performance

- [ ] Verify page load times
- [ ] Check Vercel Analytics
- [ ] Monitor Firebase usage/quotas

### SEO

- [ ] Add custom domain (optional)
- [ ] Configure robots.txt
- [ ] Set up sitemap
- [ ] Add meta tags for social sharing

---

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"

**Solution**: Add Vercel domain to Firebase authorized domains
```
Firebase Console → Authentication → Settings → Authorized domains
```

### Environment variables not working

**Solution**: Redeploy after adding env vars
```bash
vercel --prod
```

### Email verification not sending

**Solution**:
1. Check Firebase Console → Authentication → Templates
2. Verify authorized domains include your deployment URL
3. Check spam folder

### Firestore permission denied

**Solution**: Update security rules to production mode
```
Firebase Console → Firestore → Rules
```

---

## Monitoring

### Vercel Dashboard
- Build logs
- Runtime logs
- Analytics
- Performance metrics

### Firebase Console
- Authentication usage
- Firestore reads/writes
- Error logs
- User growth

---

## Rollback

If deployment has issues:

```bash
# Via CLI
vercel rollback

# Via Dashboard
Deployments → Previous deployment → "Promote to Production"
```

---

## CI/CD Setup (Optional)

**Automatic deployments on git push:**

Vercel automatically deploys:
- `main` branch → Production
- Other branches → Preview deployments

**GitHub Actions workflow** (optional):

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Custom Domain Setup

### 1. Purchase Domain
- Namecheap, GoDaddy, Cloudflare, etc.

### 2. Add to Vercel
```
Vercel Dashboard → Project Settings → Domains
→ Add domain: gatewaytokorea.com
```

### 3. Configure DNS
Follow Vercel's instructions (A record or CNAME)

### 4. Update Firebase
```
Firebase Console → Authentication → Authorized domains
→ Add: gatewaytokorea.com
```

---

## Estimated Costs

**Free Tier Limits:**

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- 1000 serverless function invocations/day

**Firebase:**
- 50,000 reads/day (Firestore)
- 20,000 writes/day (Firestore)
- 10GB storage
- Unlimited authentication

**Expected for small-medium traffic:**
- $0-25/month (likely free for first few months)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Firebase Console error logs
3. Review this deployment guide
4. Check Next.js and Firebase documentation

---

**🎉 Your Gateway to Korea app is now live!**
