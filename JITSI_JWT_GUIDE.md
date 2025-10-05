# Jitsi JWT Authentication Guide

## Overview

JSON Web Tokens (JWT) provide secure, authenticated access to your Jitsi meetings. This guide shows you how to implement JWT authentication in your WANAC Platform.

## ⚠️ Prerequisites

**JWT authentication requires a self-hosted Jitsi server.** The public meet.jit.si server does not support custom JWT.

Before implementing JWT:
1. ✅ Set up your own Jitsi server (see `JITSI_SETUP_GUIDE.md`)
2. ✅ Have a domain name configured
3. ✅ Have SSL certificates installed

---

## 🔑 Understanding JWT for Jitsi

### JWT Structure

A Jitsi JWT contains:
```json
{
  "context": {
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg"
    },
    "group": "wanac-fireteam-1"
  },
  "aud": "jitsi",
  "iss": "your-app-id",
  "sub": "meet.yourdomain.com",
  "room": "fireteam-exp-123",
  "exp": 1234567890,
  "moderator": true
}
```

### Key Fields:
- **context.user**: User information (displayed in meeting)
- **room**: Meeting room name (must match)
- **moderator**: Whether user is a moderator
- **exp**: Token expiration timestamp
- **iss**: Your application ID (from Jitsi console or self-hosted config)
- **sub**: Your Jitsi domain

---

## 🏗️ Step 1: Configure Jitsi Server for JWT

### Install JWT Authentication

On your Jitsi server:

```bash
# Install the Lua JWT library
sudo apt-get install -y lua-cjson lua-basexx

# Install prosody JWT module
sudo apt-get install -y prosody-modules-community
```

### Configure Prosody (XMPP Server)

Edit `/etc/prosody/conf.avail/meet.yourdomain.com.cfg.lua`:

```lua
VirtualHost "meet.yourdomain.com"
    authentication = "token"  -- Enable JWT authentication
    
    app_id = "your_app_id"  -- Your application identifier
    app_secret = "your_app_secret"  -- Your secret key (keep this secure!)
    
    allow_empty_token = false  -- Require valid JWT
    
    modules_enabled = {
        "bosh";
        "pubsub";
        "ping";
        "speakerstats";
        "conference_duration";
    }

-- Guest domain for unauthenticated participants (optional)
VirtualHost "guest.meet.yourdomain.com"
    authentication = "anonymous"
    c2s_require_encryption = false

-- Internal MUC component for authenticated participants
Component "conference.meet.yourdomain.com" "muc"
    restrict_room_creation = true
    storage = "memory"
    modules_enabled = {
        "muc_meeting_id";
        "muc_domain_mapper";
        "token_verification";
    }
    admins = { "focus@auth.meet.yourdomain.com" }
    muc_room_locking = false
    muc_room_default_public_jids = true
```

### Configure Jitsi Meet

Edit `/etc/jitsi/meet/meet.yourdomain.com-config.js`:

```javascript
var config = {
    hosts: {
        domain: 'meet.yourdomain.com',
        muc: 'conference.meet.yourdomain.com',
        
        // Enable guest domain (optional - for guests without JWT)
        // anonymousdomain: 'guest.meet.yourdomain.com',
    },
    
    // Enable token authentication
    enableInsecureRoomNameWarning: true,
};
```

### Restart Services

```bash
sudo systemctl restart prosody
sudo systemctl restart jicofo
sudo systemctl restart jitsi-videobridge2
```

---

## 🔧 Step 2: Generate JWT in Your Backend

### Install JWT Library

```bash
npm install jsonwebtoken
```

### Create JWT Service

Create `src/services/jitsi-jwt.service.js`:

```javascript
const jwt = require('jsonwebtoken');

class JitsiJWTService {
  constructor() {
    // These should be environment variables
    this.appId = process.env.JITSI_APP_ID || 'your_app_id';
    this.appSecret = process.env.JITSI_APP_SECRET || 'your_app_secret';
    this.jitsiDomain = process.env.JITSI_DOMAIN || 'meet.yourdomain.com';
  }

  /**
   * Generate a JWT token for a Jitsi meeting
   * @param {Object} options - Token options
   * @param {string} options.roomName - Meeting room name
   * @param {string} options.userId - User ID
   * @param {string} options.userName - User display name
   * @param {string} options.userEmail - User email
   * @param {string} options.userAvatar - User avatar URL
   * @param {boolean} options.moderator - Is user a moderator
   * @param {number} options.expiresIn - Token expiration in seconds (default: 2 hours)
   * @returns {string} JWT token
   */
  generateToken(options) {
    const {
      roomName,
      userId,
      userName,
      userEmail = '',
      userAvatar = '',
      moderator = false,
      expiresIn = 7200, // 2 hours default
    } = options;

    // Token expiration time
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresIn;

    // JWT payload
    const payload = {
      // Standard claims
      aud: 'jitsi',
      iss: this.appId,
      sub: this.jitsiDomain,
      room: roomName,
      exp: exp,
      nbf: now - 10, // Valid from 10 seconds ago (clock skew)
      
      // User context
      context: {
        user: {
          id: userId,
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          moderator: moderator ? 'true' : 'false',
        },
        // Optional: Add custom features
        features: {
          livestreaming: moderator,
          recording: moderator,
          transcription: moderator,
          'outbound-call': moderator,
        },
      },
      
      // Moderator flag
      moderator: moderator,
    };

    // Sign the token
    const token = jwt.sign(payload, this.appSecret, {
      algorithm: 'HS256',
    });

    return token;
  }

  /**
   * Verify a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.appSecret, {
        algorithms: ['HS256'],
      });
      return decoded;
    } catch (error) {
      throw new Error(`Invalid JWT token: ${error.message}`);
    }
  }

  /**
   * Generate a meeting URL with JWT token
   * @param {Object} options - Same as generateToken options
   * @returns {string} Full meeting URL with JWT
   */
  generateMeetingUrl(options) {
    const token = this.generateToken(options);
    const { roomName } = options;
    
    return `https://${this.jitsiDomain}/${roomName}?jwt=${token}`;
  }
}

// Export singleton instance
module.exports = new JitsiJWTService();
```

### Environment Variables

Add to `.env`:

```bash
# Jitsi JWT Configuration
JITSI_APP_ID=your_app_id
JITSI_APP_SECRET=your_app_secret_keep_this_secure
JITSI_DOMAIN=meet.yourdomain.com
```

---

## 🎯 Step 3: Integrate JWT in Your Application

### Update Meeting Page

Modify `src/app/client/fireteam/experience/[experienceid]/page.jsx`:

```javascript
// Add this function to generate JWT token
async function getJitsiToken(roomName, userId, userName, isModerator = false) {
  try {
    const response = await fetch('/api/jitsi/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName,
        userId,
        userName,
        moderator: isModerator,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate JWT token');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw error;
  }
}

// Update the startJitsi function to use JWT
async function startJitsi(domain, roomName) {
  try {
    console.log("🎬 Starting Jitsi meeting with JWT authentication");
    
    // Get user information (from your auth system)
    const currentUser = getCurrentUser(); // Your auth function
    const userId = currentUser.id;
    const userName = currentUser.name || 'Participant';
    const isModerator = currentUser.role === 'admin' || currentUser.role === 'coach';

    // Generate JWT token
    const jwtToken = await getJitsiToken(roomName, userId, userName, isModerator);
    
    const containerElement = document.getElementById(jitsiContainerId);
    if (!containerElement) {
      console.log("❌ Container element not found");
      return;
    }

    const options = {
      roomName,
      width: "100%",
      height: "100%",
      parentNode: containerElement,
      
      // Add JWT token to options
      jwt: jwtToken,
      
      configOverwrite: {
        // ... your existing config
      },
      interfaceConfigOverwrite: {
        // ... your existing config
      },
      userInfo: {
        displayName: userName,
        email: currentUser.email,
      },
    };

    jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    console.log("✅ Jitsi API instance created with JWT authentication");
    
    // ... rest of your event handlers
  } catch (error) {
    console.error("Failed to start meeting:", error);
    setMeetingError("Failed to start meeting. Please try again.");
  }
}
```

### Create API Endpoint

Create `src/app/api/jitsi/generate-token/route.js`:

```javascript
import { NextResponse } from 'next/server';
import jitsiJWTService from '../../../../services/jitsi-jwt.service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { roomName, userId, userName, moderator = false } = body;

    // Validate input
    if (!roomName || !userId || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Add authentication check here
    // Verify the user is authenticated and authorized

    // Generate JWT token
    const token = jitsiJWTService.generateToken({
      roomName,
      userId,
      userName,
      moderator,
      expiresIn: 7200, // 2 hours
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating JWT token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Testing JWT Authentication

### Generate Test Token

Create a test script `scripts/test-jwt.js`:

```javascript
const jitsiJWTService = require('../src/services/jitsi-jwt.service');

// Generate a test token
const token = jitsiJWTService.generateToken({
  roomName: 'test-room',
  userId: 'user-123',
  userName: 'Test User',
  userEmail: 'test@example.com',
  moderator: true,
  expiresIn: 3600, // 1 hour
});

console.log('JWT Token:', token);

// Verify the token
const decoded = jitsiJWTService.verifyToken(token);
console.log('Decoded Token:', JSON.stringify(decoded, null, 2));

// Generate meeting URL
const url = jitsiJWTService.generateMeetingUrl({
  roomName: 'test-room',
  userId: 'user-123',
  userName: 'Test User',
  moderator: true,
});

console.log('Meeting URL:', url);
```

Run it:
```bash
node scripts/test-jwt.js
```

### Test in Browser

1. Generate a token with the script above
2. Copy the meeting URL
3. Open in browser
4. You should join as authenticated user

---

## 🔒 Security Best Practices

### 1. Keep Secret Safe
```javascript
// ❌ Never commit secrets to git
const secret = 'my-secret-key';

// ✅ Use environment variables
const secret = process.env.JITSI_APP_SECRET;
```

### 2. Validate Users
```javascript
// Always verify user authentication before generating tokens
if (!isUserAuthenticated(request)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 3. Set Appropriate Expiration
```javascript
// Short expiration for security
expiresIn: 7200, // 2 hours

// Don't make tokens that last forever
expiresIn: 31536000, // ❌ 1 year is too long
```

### 4. Validate Room Access
```javascript
// Check if user has access to this specific room
if (!canUserAccessRoom(userId, roomName)) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 });
}
```

---

## 🎨 Advanced Features

### Custom User Avatars

```javascript
const token = jitsiJWTService.generateToken({
  roomName: 'fireteam-1',
  userId: user.id,
  userName: user.name,
  userAvatar: user.avatarUrl, // Custom avatar
  moderator: user.isAdmin,
});
```

### Custom Context Data

```javascript
const payload = {
  // ... standard claims
  context: {
    user: {
      id: userId,
      name: userName,
    },
    // Add custom data
    group: 'wanac-fireteam-1',
    cohort: 'spring-2024',
    role: 'participant',
    customField: 'custom-value',
  },
};
```

### Feature Toggles

```javascript
const payload = {
  // ... standard claims
  context: {
    features: {
      livestreaming: true,      // Allow live streaming
      recording: true,           // Allow recording
      transcription: false,      // Disable transcription
      'outbound-call': false,    // Disable dial-out
      'screen-sharing': true,    // Allow screen sharing
    },
  },
};
```

---

## 🐛 Troubleshooting

### Token Not Accepted

**Problem**: "Invalid JWT token" error

**Solutions**:
1. Check app_id matches in Prosody config and token
2. Verify app_secret is correct
3. Check domain matches
4. Ensure room name matches exactly
5. Check token hasn't expired

### Clock Skew Issues

**Problem**: Token rejected due to time

**Solution**: Add clock skew tolerance
```javascript
nbf: now - 10, // Valid from 10 seconds ago
exp: now + expiresIn + 10, // Valid until 10 seconds after expiry
```

### Moderator Rights Not Working

**Problem**: User joined but not a moderator

**Solution**: Check both fields are set
```javascript
moderator: true,  // Top level
context: {
  user: {
    moderator: 'true',  // String in context
  },
},
```

---

## 📊 JWT vs No JWT Comparison

| Feature | Without JWT | With JWT |
|---------|-------------|----------|
| Security | Open to anyone | Authenticated |
| User Info | Manual entry | Automatic |
| Moderators | First to join | Pre-assigned |
| Room Access | Public | Controlled |
| Setup | Simple | Complex |
| Server | Public or Self-hosted | Self-hosted only |

---

## 🚀 Migration Path

### Phase 1: Development (Current)
- Use public server without JWT
- Simple setup, fast development

### Phase 2: Testing
- Set up self-hosted server
- Implement JWT for testing
- Keep public server as fallback

### Phase 3: Production
- Migrate to self-hosted with JWT
- Full authentication and authorization
- Secure, scalable solution

---

## 📚 Additional Resources

- [Jitsi JWT Documentation](https://github.com/jitsi/lib-jitsi-meet/blob/master/doc/tokens.md)
- [JWT.io Debugger](https://jwt.io/) - Debug and decode tokens
- [Prosody JWT Module](https://github.com/jitsi-contrib/prosody-plugins/)
- [Jitsi Meet Handbook](https://jitsi.github.io/handbook/)

---

## 🎯 Quick Reference

### Generate Token
```javascript
const token = jitsiJWTService.generateToken({
  roomName: 'my-room',
  userId: 'user-123',
  userName: 'John Doe',
  moderator: true,
});
```

### Use Token in Meeting
```javascript
const options = {
  roomName: 'my-room',
  jwt: token,
  // ... other options
};
new JitsiMeetExternalAPI(domain, options);
```

### Verify Token
```javascript
const decoded = jitsiJWTService.verifyToken(token);
console.log(decoded);
```

---

**Ready to implement JWT when you need it!** 🔐

