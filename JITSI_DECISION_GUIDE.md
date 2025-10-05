# Jitsi Integration - Decision Guide

## 🎯 Quick Decision Tree

```
Do you need JWT authentication (secure access)?
│
├─ NO → ✅ Use Public Server (Current Setup)
│        - Free
│        - Already working
│        - Branding removed
│        - Good for development
│
└─ YES → Do you want to manage infrastructure?
          │
          ├─ NO → ✅ Use JaaS (RECOMMENDED)
          │        - Sign up at https://jaas.8x8.vc/
          │        - Managed service
          │        - Pay per use (~$0.09/participant-min)
          │        - No server management
          │
          └─ YES → Use Self-Hosted
                   - Set up own server
                   - $20-100/month fixed cost
                   - Full control
                   - More work
```

---

## 📊 The Three Options

### 1. Public Server (Current) ✅ ACTIVE

**Current Status:** You're using this now!

```javascript
// What you have now
const meetingLink = `https://meet.jit.si/fireteam-exp-${expId}`;

// No JWT needed, works immediately
new JitsiMeetExternalAPI('meet.jit.si', {
  roomName: 'fireteam-exp-123',
  configOverwrite: { /* branding removed */ },
});
```

**When to Use:**
- ✅ Development and testing
- ✅ Internal tools
- ✅ Low security requirements
- ✅ Want to stay free

**Pros:**
- Free forever
- Already working
- No setup needed
- Branding removed

**Cons:**
- No JWT authentication
- Open access (link = entry)
- Can't pre-assign moderators
- Subject to fair use

---

### 2. JaaS (Recommended for Production) ⭐

**What is it:** Managed Jitsi service by 8x8

```javascript
// With JaaS
const token = await generateJaaSToken(user, room);

new JitsiMeetExternalAPI('8x8.vc', {
  roomName: 'fireteam-exp-123',
  jwt: token, // Secure authenticated access
});
```

**When to Use:**
- ✅ Need security/JWT
- ✅ Don't want server management
- ✅ Production application
- ✅ Moderate usage (not massive scale)

**Pros:**
- JWT authentication included
- No server management
- Professional support
- Reliable infrastructure
- Custom branding
- Scales automatically
- Quick to implement

**Cons:**
- Costs money (pay per use)
- Vendor dependency
- Must follow their JWT format

**Cost:**
- ~$0.09 per participant-minute
- Example: 10 people, 1 hour = 600 mins = ~$54
- Example: 5 people, 30 mins = 150 mins = ~$13.50

**Sign Up:** https://jaas.8x8.vc/

---

### 3. Self-Hosted (For Full Control)

**What is it:** Your own Jitsi server

```javascript
// With self-hosted
const token = await generateSelfHostedToken(user, room);

new JitsiMeetExternalAPI('meet.yourdomain.com', {
  roomName: 'fireteam-exp-123',
  jwt: token, // Your custom JWT
});
```

**When to Use:**
- ✅ Need full control
- ✅ Large scale (high usage)
- ✅ Custom requirements
- ✅ Data privacy concerns
- ✅ Have DevOps capability

**Pros:**
- Full control
- Own your data
- Custom JWT format
- No per-minute costs
- Unlimited customization

**Cons:**
- Server costs ($20-100/month)
- Must manage infrastructure
- Requires DevOps skills
- Security is your responsibility
- Must handle scaling

---

## 💰 Cost Comparison

### Scenario: 100 hours of meetings/month

| Option | Monthly Cost | Notes |
|--------|-------------|-------|
| **Public** | $0 | Free, but no JWT |
| **JaaS** | ~$200-500 | Depends on participants |
| **Self-Hosted** | $50-100 | Fixed cost, regardless of usage |

### Scenario: 10 hours of meetings/month

| Option | Monthly Cost | Notes |
|--------|-------------|-------|
| **Public** | $0 | Free, but no JWT |
| **JaaS** | ~$20-50 | Low usage = low cost |
| **Self-Hosted** | $50-100 | Fixed cost (may not be worth it) |

### Break-Even Point:
- **JaaS becomes more expensive** than self-hosted at ~500-1000 participant-hours/month
- **JaaS is cheaper** for low to moderate usage
- **Self-hosted is cheaper** for very high usage

---

## 🚀 Implementation Readiness

### Public Server (Current)
```
Status: ✅ COMPLETE
Time: Done
Files: All ready
Action: Keep using, no changes needed
```

### JaaS
```
Status: 📦 CODE READY, NEEDS SETUP
Time: 1-2 hours
Files:
  ✅ src/services/jitsi-jaas.service.js
  ✅ src/app/api/jitsi/generate-token/route.js
  ✅ Documentation: JITSI_ALL_OPTIONS.md

Action Items:
  1. Sign up at https://jaas.8x8.vc/
  2. Get credentials (AppID, Private Key, kid)
  3. npm install jsonwebtoken
  4. Set environment variables
  5. Uncomment code in route.js
  6. Update meeting pages to request tokens
```

### Self-Hosted
```
Status: 📦 CODE READY, NEEDS SERVER
Time: 4-8 hours
Files:
  ✅ src/services/jitsi-jwt.service.js
  ✅ src/app/api/jitsi/generate-token/route.js
  ✅ Documentation: JITSI_JWT_GUIDE.md

Action Items:
  1. Set up Ubuntu server
  2. Install Jitsi Meet
  3. Configure JWT authentication
  4. npm install jsonwebtoken
  5. Set environment variables
  6. Uncomment code in route.js
  7. Update meeting pages to request tokens
```

---

## 🎯 My Recommendation for WANAC Platform

### Phase 1: Now (Development) ✅
**Use:** Public Server (current)
**Why:**
- You're building features
- Free and simple
- Already working
- Branding removed

**Action:** Nothing - keep building!

### Phase 2: Beta Testing (2-3 months)
**Use:** JaaS
**Why:**
- Need security for real users
- Don't want server headaches
- Moderate costs
- Easy to set up

**Action:** Sign up for JaaS when approaching beta

### Phase 3: Production (6-12 months)
**Evaluate:** JaaS vs Self-Hosted
**Decision Factors:**
- If usage < 500 participant-hours/month → Stay with JaaS
- If usage > 1000 participant-hours/month → Consider self-hosting
- If have DevOps team → Self-hosted viable
- If no DevOps team → Stay with JaaS

---

## 📝 Setup Instructions

### To Use JaaS (When Ready):

1. **Sign Up**
   ```bash
   # Visit https://jaas.8x8.vc/
   # Create account and tenant
   ```

2. **Get Credentials**
   ```
   Copy these from JaaS dashboard:
   - AppID: vpaas-magic-cookie-...
   - Private Key: -----BEGIN PRIVATE KEY-----...
   - kid: vpaas-magic-cookie-.../xxxxx
   ```

3. **Configure Environment**
   ```bash
   # Add to .env
   JITSI_AUTH_TYPE=jaas
   JAAS_APP_ID=vpaas-magic-cookie-1fc542a3e4414a44b2611668195e2bfe
   JAAS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
   MIIEvQIB...your key here...
   -----END PRIVATE KEY-----"
   JAAS_KID=vpaas-magic-cookie-1fc542a3e4414a44b2611668195e2bfe/4f4910
   JITSI_DOMAIN=8x8.vc
   ```

4. **Install Dependencies**
   ```bash
   npm install jsonwebtoken
   ```

5. **Activate Code**
   ```bash
   # Edit src/app/api/jitsi/generate-token/route.js
   # Uncomment the JWT generation code
   # Lines 67-107
   ```

6. **Update Meeting Pages**
   ```javascript
   // Add token request before joining
   const token = await fetch('/api/jitsi/generate-token', {
     method: 'POST',
     body: JSON.stringify({
       roomName: 'fireteam-exp-123',
       userId: user.id,
       userName: user.name,
       moderator: isCoach,
     }),
   });
   
   // Pass token to Jitsi
   new JitsiMeetExternalAPI(domain, {
     roomName: 'fireteam-exp-123',
     jwt: token,
   });
   ```

---

## ✅ Checklist: Adding JWT (JaaS)

- [ ] Sign up at https://jaas.8x8.vc/
- [ ] Create tenant and get credentials
- [ ] Save credentials securely
- [ ] Run `npm install jsonwebtoken`
- [ ] Add environment variables to `.env`
- [ ] Uncomment code in `src/app/api/jitsi/generate-token/route.js`
- [ ] Update meeting page to request tokens
- [ ] Test with multiple users
- [ ] Verify JWT authentication works
- [ ] Monitor usage and costs

---

## 🆘 Troubleshooting

### JaaS Signup Issues
- **Problem:** Can't find signup page
- **Solution:** https://jaas.8x8.vc/ (direct link)

### Token Generation Fails
- **Problem:** "Failed to generate token"
- **Check:**
  1. Is `jsonwebtoken` installed?
  2. Are environment variables set correctly?
  3. Is Private Key formatted correctly (with newlines)?
  4. Is code uncommented in route.js?

### Token Not Accepted
- **Problem:** "Invalid JWT token" error
- **Check:**
  1. AppID matches JaaS dashboard
  2. kid is correct
  3. Private Key is correct
  4. Room name matches
  5. Token hasn't expired

---

## 📚 Documentation Index

| File | Purpose |
|------|---------|
| `JITSI_QUICK_START.md` | Quick overview of what was done |
| `JITSI_SETUP_GUIDE.md` | Self-hosted Jitsi setup |
| `JITSI_ALL_OPTIONS.md` | All three options explained |
| `JITSI_JWT_GUIDE.md` | Self-hosted JWT implementation |
| `JITSI_JWT_SUMMARY.md` | JWT summary and decision guide |
| `JITSI_DECISION_GUIDE.md` | This file - complete decision guide |

---

## 🎉 Summary

**Where you are now:** ✅ 
- Public server working
- Branding removed
- Perfect for development

**Next step (when ready):**
1. Sign up for JaaS
2. Follow checklist above
3. Add JWT authentication
4. Deploy to production

**Need help?** Review the documentation files above or ask!

---

**Bottom Line:** Keep using public server for now. Add JaaS when you need security for production. 🚀

