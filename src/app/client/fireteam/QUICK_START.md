# Fireteam Meeting - Quick Start Guide

## 🚀 Quick Setup

### Files Modified:
1. ✅ `/experience/[experienceid]/page.jsx` - Main meeting page (enhanced)
2. ✅ `/components/EnhancedMeetingControls.jsx` - Advanced controls (NEW)
3. ✅ `/components/AgendaTimer.jsx` - Step timer (NEW)
4. ✅ `/components/EnhancedAgendaSidebar.jsx` - Enhanced sidebar (existing)

---

## ⚡ Key Features at a Glance

### Meeting Controls:
| Button | Function | Shortcut |
|--------|----------|----------|
| 🎤 | Toggle Microphone | - |
| 📹 | Toggle Camera | - |
| 🖥️ | Screen Share | - |
| 🎭 | Toggle Layout | - |
| 📊 | Tile View | - |
| 😊 | Send Reaction | - |
| ✋ | Raise Hand | - |
| 🛡️ | Mute All (Manager) | - |
| ⏺️ | Recording (Manager) | - |
| 📞 | Leave Meeting | - |

### Reactions Available:
👍 ❤️ 😂 😮 👏 🎉

---

## 📊 Enhanced Jitsi Configuration

### Video Quality:
- **Resolution**: 720p (up to 1080p)
- **Frame Rate**: 30 FPS
- **Aspect Ratio**: 16:9

### Audio Quality:
- **Noise Suppression**: Enabled
- **Echo Cancellation**: Enabled
- **Audio Level Detection**: Enabled

### Connection:
- **P2P Mode**: Enabled
- **Multiple STUN Servers**: Yes
- **Auto ICE Restart**: Yes

---

## 🎯 Usage Patterns

### Starting a Session:
```javascript
// Auto-starts when page loads
// URL: /client/fireteam/experience/[id]?id=X&fireteamId=Y
```

### Checking Connection:
- Green dot = Excellent
- Light green = Good
- Yellow = Fair
- Red = Poor

### Managing Timer:
- ▶️ Play/Resume
- ⏸️ Pause
- 🔄 Reset
- Auto-complete notification

---

## 🔧 Configuration Options

### Enable/Disable Features:

```jsx
// In Jitsi options
configOverwrite: {
  disableReactions: false,        // Change to true to disable
  disablePolls: false,            // Change to true to disable
  enableNoisyMicDetection: true,  // Change to false to disable
  fileRecordingsEnabled: true,    // Change to false to disable
}
```

### Customize Timer:
```jsx
// In AgendaTimer component
<AgendaTimer
  duration="45 mins"              // Any format: "X mins", "X min"
  isActive={true}                 // Auto-start
  onTimeUp={handleComplete}       // Callback when done
  stepTitle="Discussion"          // Display name
/>
```

---

## 🎨 Customization

### Theme Colors:
- Primary: Blue (#2563EB)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Neutral: Gray (#6B7280)

### Control Bar Style:
- Background: White
- Border Radius: Full (rounded-full)
- Shadow: Large (shadow-lg)
- Padding: 1.5rem (px-6 py-3)

---

## 📈 Performance Tips

1. **Close Unnecessary Apps**: Free up system resources
2. **Use Wired Connection**: Better stability than WiFi
3. **Limit Participants**: 25 max for best performance
4. **Lower Video Quality**: If experiencing lag
5. **Disable Video**: Use audio-only if needed

---

## 🐛 Common Fixes

### Video Not Showing:
```javascript
// Check browser permissions
navigator.mediaDevices.getUserMedia({ video: true })
```

### Audio Issues:
```javascript
// Verify mic access
navigator.mediaDevices.getUserMedia({ audio: true })
```

### Meeting Won't Start:
1. Clear browser cache
2. Refresh page
3. Check console for errors
4. Verify meeting URL parameters

---

## 📱 Browser Support

### Recommended:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Features by Browser:
| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Video | ✅ | ✅ | ✅ | ✅ |
| Audio | ✅ | ✅ | ✅ | ✅ |
| Screen Share | ✅ | ✅ | ⚠️ | ✅ |
| Recording | ✅ | ✅ | ❌ | ✅ |
| Reactions | ✅ | ✅ | ✅ | ✅ |

---

## 🔐 Security Checklist

- [ ] Unique room names
- [ ] Secure HTTPS connection
- [ ] No public meeting links
- [ ] Recording permissions set
- [ ] Attendance logging enabled
- [ ] Participant management ready

---

## 📞 Emergency Actions

### If Meeting Disrupted:
1. Click "Leave Meeting"
2. Refresh browser
3. Rejoin with same URL
4. Contact support if persistent

### If Recording Fails:
1. Check manager permissions
2. Verify storage space
3. Restart recording
4. Check server logs

---

## 💡 Pro Tips

1. **Use Timer**: Keep sessions on track
2. **Enable Reactions**: Boost engagement
3. **Monitor Connection**: Address issues early
4. **Review Attendance**: Track participation
5. **Export Data**: Keep session records
6. **Test First**: Always test before important sessions

---

## 📚 Additional Resources

- [Full Documentation](./MEETING_ENHANCEMENTS.md)
- [Jitsi API Docs](https://jitsi.github.io/handbook/)
- [React Best Practices](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Need Help?** Check console logs or contact platform administrator.

