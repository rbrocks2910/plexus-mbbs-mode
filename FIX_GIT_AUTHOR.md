# Fix Git Author Configuration for Vercel Deployments

## Problem
Commits with unverified or incorrect email addresses don't trigger Vercel deployments.

## Solution for Krish

### Step 1: Configure Git with your GitHub email
Run these commands in your terminal:

```bash
git config --global user.name "Krishwall"
git config --global user.email "krishjaiswal523@gmail.com"
```

**Important**: Make sure `krishjaiswal523@gmail.com` is:
- Verified in your GitHub account settings
- Or use your GitHub noreply email: `98252737+Krishwall@users.noreply.github.com`

### Step 2: Verify the configuration
```bash
git config user.name
git config user.email
```

### Step 3: Future commits will now work correctly
All future commits will automatically use the correct author information and trigger Vercel deployments.

---

## For Rishit: Manually Trigger Deployment

Since Krish's recent commits didn't auto-deploy, you can manually trigger a deployment:

1. Go to https://vercel.com/dashboard
2. Select your `plexus-medical-app` project
3. Go to the "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Or make a small commit (like updating a comment) to trigger a new deployment

---

## Alternative: Use GitHub Noreply Email (Recommended)

If Krish wants to keep email private, use GitHub's noreply email:

```bash
git config --global user.email "98252737+Krishwall@users.noreply.github.com"
```

This is automatically verified by GitHub and will work with Vercel.

---

## Why This Matters

Vercel uses GitHub's webhook system to detect new commits. It needs to verify that:
1. The commit comes from the connected repository
2. The author is associated with a valid GitHub account
3. The email is verified (or uses GitHub noreply)

When commits have unverified emails like `krish@example.com`, Vercel can't verify the commit's authenticity and won't trigger deployments.
