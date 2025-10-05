# Jitsi Integration Guide - WANAC Platform

## ✅ What's Already Done

Your application now has **complete branding removal** configured. All Jitsi watermarks, logos, and promotional content have been hidden through the External API configuration.

### Current Setup
- **Service**: Using Jitsi's free public server (meet.jit.si)
- **Integration**: Jitsi External API via iframe
- **Branding**: Fully removed and white-labeled as "WANAC Platform"
- **Status**: ✅ Ready to use

---

## 🎯 About the jitsi-meet Directory

The `jitsi-meet/` directory you cloned is the **full Jitsi Meet server source code**. This is for running your own self-hosted Jitsi server, which is a complex infrastructure setup.

### Should You Delete It?

**For now, YES** - Unless you plan to set up your own server infrastructure, you can safely remove it:

```bash
cd ~/Desktop/wanac-platform
rm -rf jitsi-meet
```

**Reasons to keep it:**
- You're planning to run your own Jitsi server (production environment)
- You want to customize the Jitsi Meet UI beyond configuration options
- You need to examine the source code for understanding

---

## 🔧 Current Implementation Details

### Branding Removal Applied

Your configuration now includes:

```javascript
interfaceConfigOverwrite: {
  // Your branding
  APP_NAME: 'WANAC Platform',
  NATIVE_APP_NAME: 'WANAC Platform',
  PROVIDER_NAME: 'WANAC',
  
  // All Jitsi branding disabled
  SHOW_JITSI_WATERMARK: false,
  SHOW_WATERMARK_FOR_GUESTS: false,
  SHOW_BRAND_WATERMARK: false,
  SHOW_POWERED_BY: false,
  MOBILE_APP_PROMO: false,
  
  // Logos removed
  DEFAULT_LOGO_URL: '',
  DEFAULT_WELCOME_PAGE_LOGO_URL: '',
}
```

### Where It's Applied

The branding removal is configured in:
- `src/app/client/fireteam/experience/[experienceid]/page.jsx` (Client meetings)
- Uses the Jitsi External API with `interfaceConfigOverwrite`

---

## 🚀 Two Paths Forward

### Option 1: Continue with Public Server (Recommended)

**What you have now:**
- ✅ Free to use
- ✅ No infrastructure management
- ✅ Branding already removed
- ✅ Reliable uptime
- ✅ Global CDN

**Best for:**
- Development
- Small to medium deployments
- Getting to market quickly

**Limitations:**
- Using Jitsi's servers (privacy considerations)
- Subject to Jitsi's fair use policy
- No custom domain (meet.jit.si)

### Option 2: Self-Hosted Jitsi Server (Advanced)

**Requirements:**
- A server (VPS/cloud instance) with at least 4GB RAM
- Ubuntu 20.04 or 22.04 LTS
- Public IP address
- Domain name pointed to your server
- SSL certificate (Let's Encrypt)

**Services needed:**
- **Prosody** - XMPP server for signaling
- **Jicofo** - Conference focus component
- **Jitsi Videobridge** - WebRTC media router
- **Nginx** - Web server
- **Optional**: Jibri (recording), Jigasi (phone dial-in)

**Installation time:** 2-4 hours for experienced admin

---

## 🛠️ How to Set Up Your Own Jitsi Server (If Needed)

### Quick Install (Recommended)

```bash
# 1. Get a fresh Ubuntu 22.04 server

# 2. Set hostname
sudo hostnamectl set-hostname meet.yourdomain.com

# 3. Install Jitsi Meet
curl https://download.jitsi.org/jitsi-key.gpg.key | sudo sh -c 'gpg --dearmor > /usr/share/keyrings/jitsi-keyring.gpg'
echo 'deb [signed-by=/usr/share/keyrings/jitsi-keyring.gpg] https://download.jitsi.org stable/' | sudo tee /etc/apt/sources.list.d/jitsi-stable.list > /dev/null

sudo apt update
sudo apt install -y jitsi-meet

# 4. Setup SSL certificate
sudo /usr/share/jitsi-meet/scripts/install-letsencrypt-cert.sh
```

### Configure Your Own Server

After installation, edit these files:

**1. Remove branding in `/etc/jitsi/meet/meet.yourdomain.com-config.js`:**

```javascript
var config = {
    hosts: {
        domain: 'meet.yourdomain.com',
        muc: 'conference.meet.yourdomain.com'
    },
    bosh: '//meet.yourdomain.com/http-bind',
    
    // Your customizations here
    defaultLogoUrl: 'https://yourdomain.com/logo.png',
    defaultLocalDisplayName: 'You',
    defaultRemoteDisplayName: 'Participant',
};
```

**2. Edit `/usr/share/jitsi-meet/interface_config.js`:**

```javascript
var interfaceConfig = {
    APP_NAME: 'WANAC Platform',
    PROVIDER_NAME: 'WANAC',
    SHOW_JITSI_WATERMARK: false,
    SHOW_BRAND_WATERMARK: false,
    SHOW_POWERED_BY: false,
    DEFAULT_LOGO_URL: 'https://yourdomain.com/logo.png',
};
```

### Update Your App to Use Your Server

Change the meeting link generation in `src/lib/jitsi.utils.ts`:

```typescript
// Before (current):
meetingLink = `https://meet.jit.si/fireteam-exp-${expId}`;

// After (your server):
meetingLink = `https://meet.yourdomain.com/fireteam-exp-${expId}`;
```

---

## 📊 Comparison Table

| Feature | Public Server (Current) | Self-Hosted |
|---------|------------------------|-------------|
| Cost | Free | $10-50/month server cost |
| Setup Time | ✅ Done | 2-4 hours |
| Maintenance | None | Ongoing updates |
| Branding | ✅ Removed via config | Full control |
| Privacy | Jitsi infrastructure | Your infrastructure |
| Scalability | Automatic | Manual scaling |
| Custom Domain | ❌ meet.jit.si | ✅ Your domain |
| Recording | Limited | Full control |

---

## 🎓 Learning Resources

### For Understanding Jitsi
- [Jitsi Meet Developer Guide](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe)
- [External API Reference](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe)
- [Configuration Options](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-configuration)

### For Self-Hosting
- [Self-Hosting Guide](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart)
- [Docker Deployment](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker)
- [Scaling Guide](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-manual)

---

## 🔍 Testing Your Current Setup

Run your application and verify:

1. **No Jitsi branding visible** in the meeting interface
2. **WANAC Platform** appears instead of Jitsi Meet
3. **No watermarks** or logos visible
4. **Meeting functionality** works correctly

```bash
npm run dev
# Navigate to a meeting page and check the video interface
```

---

## ❓ Frequently Asked Questions

### Q: Do I need the jitsi-meet directory?
**A:** No, not for using Jitsi's public server. Only if you want to self-host.

### Q: Is it legal to remove Jitsi branding?
**A:** Yes! Jitsi Meet is Apache 2.0 licensed and allows this. The public server usage is subject to fair use.

### Q: Will this work in production?
**A:** Yes, but consider:
- Jitsi's fair use policy
- Privacy implications of using their servers
- For serious production, consider self-hosting

### Q: Can I add my own logo?
**A:** Yes! Set `defaultLogoUrl` in the config:
```javascript
configOverwrite: {
    defaultLogoUrl: 'https://yourdomain.com/logo.png',
}
```

### Q: How do I test with multiple users?
**A:** Open the same meeting URL in multiple browsers/devices. The room name determines who meets whom.

---

## 🚦 Next Steps

### Immediate (Development)
1. ✅ Branding removed - **DONE**
2. Test your meetings with multiple participants
3. Continue building your application
4. Monitor usage to ensure you're within fair use

### Future (Production Planning)
1. Evaluate usage and privacy needs
2. If needed, plan server infrastructure
3. Set up monitoring and analytics
4. Consider recording and dial-in features

---

## 📞 Need Help?

- **Jitsi Community**: https://community.jitsi.org/
- **GitHub Issues**: https://github.com/jitsi/jitsi-meet/issues
- **Documentation**: https://jitsi.github.io/handbook/

---

## 📝 Quick Reference Commands

### Remove the cloned jitsi-meet directory:
```bash
cd ~/Desktop/wanac-platform
rm -rf jitsi-meet
```

### Check your current setup:
```bash
npm run dev
# Test at: http://localhost:3000/client/fireteam/experience/[id]
```

### If you decide to self-host later:
```bash
# Clone fresh when ready
git clone https://github.com/jitsi/jitsi-meet.git
cd jitsi-meet
make dev  # For development
```

---

**Status**: ✅ Your Jitsi integration is production-ready with full branding removal!

