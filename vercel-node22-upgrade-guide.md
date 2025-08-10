# Vercel Node.js 22 Runtime Upgrade Guide

**Project:** ozarkedge-wildflowers  
**Goal:** Update Vercel project to use Node.js 22.x for builds and serverless functions  
**Status:** Ready for execution

## Current Configuration Status

✅ **Local Environment:** Node.js 22.18.0 active  
✅ **package.json engines.node:** Updated to "22.x"  
✅ **Dependencies:** All compatible with Node 22  
✅ **Sanity v4:** Upgraded and verified working

## Vercel Runtime Update Options

### Option 1: Vercel Dashboard (Recommended)

1. **Access Project Settings**

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select the `ozarkedge-wildflowers` project
   - Navigate to **Settings** → **General**

2. **Update Node.js Version**

   - Scroll to **Build & Development Settings**
   - Find **Node.js Version** setting
   - Change from "18.x" to **"22.x"**
   - Click **Save**

3. **Verify Function Runtime**
   - Navigate to **Settings** → **Functions**
   - Ensure **Runtime** is set to "Node.js 22.x"
   - If not available, it will use the latest supported version

### Option 2: Vercel CLI Method

```bash
# Install/Update Vercel CLI
npm install -g vercel@latest

# Login to Vercel
vercel login

# Link project (if not already linked)
vercel link

# Check current project settings
vercel project ls

# Update project settings via CLI
vercel env list  # Check environment variables
```

### Option 3: vercel.json Configuration (Optional)

Create `vercel.json` in project root for explicit configuration:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "functions": {
    "app/api/**": {
      "runtime": "nodejs22.x"
    }
  },
  "framework": "nextjs"
}
```

## Validation Steps

### 1. Check Build Success

- Trigger new deployment after Node version change
- Monitor build logs for Node 22 usage
- Look for: `Using Node.js 22.x`

### 2. Verify Function Runtime

- Test API routes and serverless functions
- Check function logs show Node 22.x runtime
- Verify no runtime errors

### 3. Performance Check

- Monitor build times (should be similar or faster)
- Check cold start performance
- Verify memory usage is consistent

## Post-Upgrade Actions

1. **Monitor First Deployment**

   ```bash
   # Watch deployment logs
   vercel logs --follow
   ```

2. **Test Critical Paths**

   - Homepage load time
   - Sanity Studio functionality
   - Native plants pages
   - Image loading performance

3. **Check Analytics**
   - Monitor Vercel Analytics for errors
   - Watch Core Web Vitals metrics
   - Verify no performance regressions

## Troubleshooting

### Common Issues

**Build Failures:**

- Check for deprecated packages in build logs
- Verify all dependencies support Node 22
- Review our compatibility audit in `node22-compatibility-report.md`

**Function Errors:**

- Verify API routes use supported Node 22 features
- Check for ESM/CommonJS compatibility issues
- Review serverless function memory limits

**Performance Issues:**

- Compare before/after metrics
- Check for new Node 22 optimizations
- Monitor bundle size changes

### Rollback Plan

If issues occur:

1. Revert Node.js version to "18.x" in Vercel dashboard
2. Redeploy previous working commit
3. Monitor for stability
4. Address specific issues before re-attempting upgrade

## Success Criteria

- [ ] Vercel project settings show Node.js 22.x
- [ ] New deployments use Node 22 runtime
- [ ] All builds complete successfully
- [ ] Serverless functions work correctly
- [ ] No performance regressions
- [ ] Sanity Studio remains functional
- [ ] Core site features work as expected

## Next Steps

After successful Vercel upgrade:

1. Create deployment validation script (`Task 9`)
2. Run comprehensive testing on preview deployment (`Task 10`)
3. Promote to production with monitoring
4. Implement Sanity v4 feature improvements (`Task 11`)

---

**Note:** Vercel typically auto-detects Node version from `package.json` engines field, but explicitly setting it in the dashboard ensures consistency and provides better control over the runtime environment.
