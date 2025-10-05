/**
 * Jitsi JWT Service
 * Generates and verifies JWT tokens for Jitsi Meet authentication
 * 
 * NOTE: JWT authentication requires a self-hosted Jitsi server.
 * This will NOT work with the public meet.jit.si server.
 * 
 * See JITSI_JWT_GUIDE.md for setup instructions.
 */

const jwt = require('jsonwebtoken');

class JitsiJWTService {
  constructor() {
    // Configuration from environment variables
    this.appId = process.env.JITSI_APP_ID || 'wanac-platform';
    this.appSecret = process.env.JITSI_APP_SECRET || 'change-this-secret';
    this.jitsiDomain = process.env.JITSI_DOMAIN || 'meet.jit.si';
    
    // Warn if using defaults
    if (!process.env.JITSI_APP_SECRET) {
      console.warn('⚠️  WARNING: Using default JITSI_APP_SECRET. Set environment variable for production!');
    }
  }

  /**
   * Generate a JWT token for a Jitsi meeting
   * 
   * @param {Object} options - Token configuration
   * @param {string} options.roomName - Meeting room name (required)
   * @param {string} options.userId - Unique user identifier (required)
   * @param {string} options.userName - User display name (required)
   * @param {string} [options.userEmail=''] - User email address
   * @param {string} [options.userAvatar=''] - User avatar URL
   * @param {boolean} [options.moderator=false] - Whether user is a moderator
   * @param {number} [options.expiresIn=7200] - Token expiration in seconds (default: 2 hours)
   * @param {Object} [options.features={}] - Custom feature flags
   * @param {Object} [options.context={}] - Additional context data
   * @returns {string} Signed JWT token
   * 
   * @example
   * const token = jitsiJWTService.generateToken({
   *   roomName: 'fireteam-exp-123',
   *   userId: 'user-456',
   *   userName: 'John Doe',
   *   userEmail: 'john@example.com',
   *   moderator: true,
   *   expiresIn: 3600, // 1 hour
   * });
   */
  generateToken(options) {
    // Validate required fields
    const {
      roomName,
      userId,
      userName,
      userEmail = '',
      userAvatar = '',
      moderator = false,
      expiresIn = 7200, // 2 hours default
      features = {},
      context = {},
    } = options;

    if (!roomName || !userId || !userName) {
      throw new Error('roomName, userId, and userName are required');
    }

    // Calculate token timestamps
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresIn;
    const nbf = now - 10; // Valid from 10 seconds ago (handles clock skew)

    // Build default features for moderators
    const defaultFeatures = moderator ? {
      livestreaming: true,
      recording: true,
      transcription: true,
      'outbound-call': true,
      'screen-sharing': true,
    } : {
      'screen-sharing': true,
    };

    // Merge custom features with defaults
    const mergedFeatures = { ...defaultFeatures, ...features };

    // Build JWT payload
    const payload = {
      // Standard JWT claims
      aud: 'jitsi',
      iss: this.appId,
      sub: this.jitsiDomain,
      exp: exp,
      nbf: nbf,
      iat: now,
      
      // Jitsi-specific claims
      room: roomName,
      moderator: moderator,
      
      // User context
      context: {
        user: {
          id: userId,
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          moderator: moderator ? 'true' : 'false',
        },
        features: mergedFeatures,
        ...context, // Merge any additional context
      },
    };

    // Sign and return the token
    try {
      const token = jwt.sign(payload, this.appSecret, {
        algorithm: 'HS256',
      });
      
      console.log(`✅ JWT token generated for user ${userName} (${userId}) in room ${roomName}`);
      return token;
    } catch (error) {
      console.error('❌ Failed to generate JWT token:', error);
      throw new Error(`Failed to generate JWT token: ${error.message}`);
    }
  }

  /**
   * Verify and decode a JWT token
   * 
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid or expired
   * 
   * @example
   * try {
   *   const decoded = jitsiJWTService.verifyToken(token);
   *   console.log('Token valid for user:', decoded.context.user.name);
   * } catch (error) {
   *   console.error('Invalid token:', error.message);
   * }
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.appSecret, {
        algorithms: ['HS256'],
      });
      
      console.log(`✅ JWT token verified for user ${decoded.context?.user?.name}`);
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('JWT token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid JWT token');
      } else {
        throw new Error(`JWT verification failed: ${error.message}`);
      }
    }
  }

  /**
   * Generate a complete meeting URL with JWT token
   * 
   * @param {Object} options - Same as generateToken options
   * @returns {string} Full meeting URL with JWT parameter
   * 
   * @example
   * const url = jitsiJWTService.generateMeetingUrl({
   *   roomName: 'fireteam-exp-123',
   *   userId: 'user-456',
   *   userName: 'John Doe',
   *   moderator: true,
   * });
   * // Returns: https://meet.yourdomain.com/fireteam-exp-123?jwt=eyJhbGc...
   */
  generateMeetingUrl(options) {
    const token = this.generateToken(options);
    const { roomName } = options;
    
    const url = `https://${this.jitsiDomain}/${roomName}?jwt=${token}`;
    console.log(`🔗 Meeting URL generated: ${url.substring(0, 50)}...`);
    
    return url;
  }

  /**
   * Decode a token without verifying (useful for debugging)
   * 
   * @param {string} token - JWT token to decode
   * @returns {Object} Decoded token payload (unverified)
   * 
   * @example
   * const decoded = jitsiJWTService.decodeToken(token);
   * console.log('Token expires at:', new Date(decoded.exp * 1000));
   */
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      throw new Error(`Failed to decode token: ${error.message}`);
    }
  }

  /**
   * Check if a token is expired
   * 
   * @param {string} token - JWT token to check
   * @returns {boolean} True if token is expired
   * 
   * @example
   * if (jitsiJWTService.isTokenExpired(token)) {
   *   console.log('Token needs to be refreshed');
   * }
   */
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      const exp = decoded.payload.exp;
      const now = Math.floor(Date.now() / 1000);
      
      return exp < now;
    } catch (error) {
      return true; // If we can't decode it, consider it expired
    }
  }

  /**
   * Get token expiration time
   * 
   * @param {string} token - JWT token
   * @returns {Date} Expiration date
   * 
   * @example
   * const expiresAt = jitsiJWTService.getTokenExpiration(token);
   * console.log('Token expires at:', expiresAt.toLocaleString());
   */
  getTokenExpiration(token) {
    const decoded = this.decodeToken(token);
    const exp = decoded.payload.exp;
    return new Date(exp * 1000);
  }

  /**
   * Get time until token expires (in seconds)
   * 
   * @param {string} token - JWT token
   * @returns {number} Seconds until expiration (negative if expired)
   * 
   * @example
   * const timeLeft = jitsiJWTService.getTimeUntilExpiration(token);
   * console.log(`Token expires in ${timeLeft} seconds`);
   */
  getTimeUntilExpiration(token) {
    const decoded = this.decodeToken(token);
    const exp = decoded.payload.exp;
    const now = Math.floor(Date.now() / 1000);
    
    return exp - now;
  }

  /**
   * Generate a token for a WANAC fireteam experience
   * Helper method specific to WANAC platform
   * 
   * @param {Object} options
   * @param {string} options.experienceId - Experience ID
   * @param {string} options.fireteamId - Fireteam ID
   * @param {Object} options.user - User object with id, name, email
   * @param {boolean} [options.isCoach=false] - Whether user is a coach/admin
   * @returns {string} JWT token
   * 
   * @example
   * const token = jitsiJWTService.generateFireteamToken({
   *   experienceId: '123',
   *   fireteamId: '456',
   *   user: { id: 'user-789', name: 'John Doe', email: 'john@example.com' },
   *   isCoach: true,
   * });
   */
  generateFireteamToken({ experienceId, fireteamId, user, isCoach = false }) {
    const roomName = `fireteam-exp-${experienceId}`;
    
    return this.generateToken({
      roomName,
      userId: user.id,
      userName: user.name,
      userEmail: user.email || '',
      userAvatar: user.avatar || '',
      moderator: isCoach,
      context: {
        fireteam: {
          id: fireteamId,
          experienceId: experienceId,
        },
        role: isCoach ? 'coach' : 'participant',
      },
    });
  }
}

// Export singleton instance
module.exports = new JitsiJWTService();

