/**
 * Jitsi as a Service (JaaS) JWT Service
 * 
 * This service generates JWT tokens for JaaS (8x8's managed Jitsi service).
 * 
 * JaaS uses RS256 (RSA) algorithm, unlike self-hosted which uses HS256.
 * 
 * Sign up at: https://jaas.8x8.vc/
 * Documentation: https://developer.8x8.com/jaas/docs
 */

const jwt = require('jsonwebtoken');

class JitsiJaaSService {
  constructor() {
    // JaaS Configuration from environment variables
    this.appId = process.env.JAAS_APP_ID || '';
    this.privateKey = process.env.JAAS_PRIVATE_KEY || '';
    this.kid = process.env.JAAS_KID || '';
    this.domain = process.env.JITSI_DOMAIN || '8x8.vc';
    
    // Warn if not configured
    if (!this.appId || !this.privateKey || !this.kid) {
      console.warn('⚠️  WARNING: JaaS not configured. Set JAAS_APP_ID, JAAS_PRIVATE_KEY, and JAAS_KID environment variables.');
      console.warn('ℹ️  Sign up at: https://jaas.8x8.vc/');
    }
  }

  /**
   * Check if JaaS is configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!(this.appId && this.privateKey && this.kid);
  }

  /**
   * Generate a JaaS JWT token
   * 
   * @param {Object} options - Token configuration
   * @param {string} options.roomName - Meeting room name (required)
   * @param {string} options.userId - Unique user identifier (required)
   * @param {string} options.userName - User display name (required)
   * @param {string} [options.userEmail=''] - User email address
   * @param {string} [options.userAvatar=''] - User avatar URL
   * @param {boolean} [options.moderator=false] - Whether user is a moderator
   * @param {boolean} [options.hiddenFromRecorder=false] - Hide from recording/streaming
   * @param {Object} [options.features={}] - Feature permissions
   * @param {number} [options.expiresIn=7200] - Token expiration in seconds (default: 2 hours)
   * @param {boolean} [options.roomRegex=false] - If true, roomName is treated as regex
   * @returns {string} Signed JWT token
   * 
   * @example
   * const token = jaasService.generateToken({
   *   roomName: 'fireteam-exp-123',
   *   userId: 'user-456',
   *   userName: 'John Doe',
   *   userEmail: 'john@example.com',
   *   moderator: true,
   *   features: {
   *     livestreaming: true,
   *     recording: true,
   *     transcription: false,
   *   },
   * });
   */
  generateToken(options) {
    // Check if JaaS is configured
    if (!this.isConfigured()) {
      throw new Error('JaaS is not configured. Please set environment variables.');
    }

    // Validate required fields
    const {
      roomName,
      userId,
      userName,
      userEmail = '',
      userAvatar = '',
      moderator = false,
      hiddenFromRecorder = false,
      features = {},
      expiresIn = 7200, // 2 hours default
      roomRegex = false,
    } = options;

    if (!roomName || !userId || !userName) {
      throw new Error('roomName, userId, and userName are required');
    }

    // Calculate token timestamps
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresIn;
    const nbf = now - 10; // Valid from 10 seconds ago (handles clock skew)

    // Build default features for moderators
    const defaultFeatures = {
      livestreaming: moderator,
      recording: moderator,
      transcription: moderator,
      'sip-inbound-call': false,
      'sip-outbound-call': false,
      'inbound-call': false,
      'outbound-call': false,
      'file-upload': true,
      'list-visitors': moderator,
      'send-groupchat': true,
      'create-polls': moderator,
    };

    // Merge custom features with defaults
    const mergedFeatures = { ...defaultFeatures, ...features };

    // Build JWT header (JaaS specific - uses RS256 and kid)
    const header = {
      alg: 'RS256',
      kid: this.kid,
      typ: 'JWT',
    };

    // Build JWT payload (JaaS format)
    const payload = {
      // JaaS required claims
      aud: 'jitsi',
      iss: 'chat',
      sub: this.appId,
      room: roomName,
      exp: exp,
      nbf: nbf,
      
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
        room: {
          regex: roomRegex,
        },
      },
    };

    // Add hidden-from-recorder if true
    if (hiddenFromRecorder) {
      payload.context.user['hidden-from-recorder'] = 'true';
    }

    // Sign the token with RSA private key
    try {
      const token = jwt.sign(payload, this.privateKey, {
        algorithm: 'RS256',
        header: header,
      });
      
      console.log(`✅ JaaS JWT token generated for user ${userName} (${userId}) in room ${roomName}`);
      return token;
    } catch (error) {
      console.error('❌ Failed to generate JaaS JWT token:', error);
      throw new Error(`Failed to generate JaaS JWT token: ${error.message}`);
    }
  }

  /**
   * Generate a token with wildcard room access (all rooms)
   * 
   * @param {Object} options - Same as generateToken but roomName is optional
   * @returns {string} JWT token valid for all rooms
   * 
   * @example
   * const token = jaasService.generateWildcardToken({
   *   userId: 'admin-123',
   *   userName: 'Admin User',
   *   moderator: true,
   * });
   */
  generateWildcardToken(options) {
    return this.generateToken({
      ...options,
      roomName: '*', // Wildcard for all rooms
    });
  }

  /**
   * Generate a token for regex room matching
   * 
   * @param {Object} options - Same as generateToken
   * @param {string} options.roomPattern - Regex pattern for room names
   * @returns {string} JWT token valid for rooms matching pattern
   * 
   * @example
   * // Allow access to all fireteam experience rooms
   * const token = jaasService.generateRegexToken({
   *   roomPattern: 'fireteam-exp-.*',
   *   userId: 'user-123',
   *   userName: 'John Doe',
   * });
   */
  generateRegexToken(options) {
    const { roomPattern, ...rest } = options;
    
    return this.generateToken({
      ...rest,
      roomName: roomPattern,
      roomRegex: true,
    });
  }

  /**
   * Verify a JaaS JWT token (for debugging)
   * Note: Typically verification is done by JaaS servers
   * 
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      // For JaaS, we'd need the public key to verify
      // This is mainly for debugging - decode without verification
      const decoded = jwt.decode(token, { complete: true });
      
      if (!decoded) {
        throw new Error('Failed to decode token');
      }
      
      console.log(`ℹ️  Token decoded for user ${decoded.payload?.context?.user?.name}`);
      return decoded.payload;
    } catch (error) {
      throw new Error(`Failed to verify JaaS token: ${error.message}`);
    }
  }

  /**
   * Generate a complete JaaS meeting URL with JWT token
   * 
   * @param {Object} options - Same as generateToken options
   * @returns {string} Full meeting URL with JWT parameter
   * 
   * @example
   * const url = jaasService.generateMeetingUrl({
   *   roomName: 'fireteam-exp-123',
   *   userId: 'user-456',
   *   userName: 'John Doe',
   *   moderator: true,
   * });
   * // Returns: https://8x8.vc/vpaas-magic-cookie-.../fireteam-exp-123?jwt=eyJhbGc...
   */
  generateMeetingUrl(options) {
    const token = this.generateToken(options);
    const { roomName } = options;
    
    // JaaS URL format includes the AppID in the path
    const url = `https://${this.domain}/${this.appId}/${roomName}?jwt=${token}`;
    console.log(`🔗 JaaS meeting URL generated: ${url.substring(0, 70)}...`);
    
    return url;
  }

  /**
   * Decode a token without verification (for debugging)
   * 
   * @param {string} token - JWT token to decode
   * @returns {Object} Decoded token with header and payload
   * 
   * @example
   * const decoded = jaasService.decodeToken(token);
   * console.log('Token expires at:', new Date(decoded.payload.exp * 1000));
   * console.log('User:', decoded.payload.context.user.name);
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
   */
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      const exp = decoded.payload.exp;
      const now = Math.floor(Date.now() / 1000);
      
      return exp < now;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   * 
   * @param {string} token - JWT token
   * @returns {Date} Expiration date
   */
  getTokenExpiration(token) {
    const decoded = this.decodeToken(token);
    const exp = decoded.payload.exp;
    return new Date(exp * 1000);
  }

  /**
   * Generate a token for a WANAC fireteam experience
   * Helper method specific to WANAC platform
   * 
   * @param {Object} options
   * @param {string} options.experienceId - Experience ID
   * @param {string} options.fireteamId - Fireteam ID
   * @param {Object} options.user - User object with id, name, email, avatar
   * @param {boolean} [options.isCoach=false] - Whether user is a coach/admin
   * @returns {string} JWT token
   * 
   * @example
   * const token = jaasService.generateFireteamToken({
   *   experienceId: '123',
   *   fireteamId: '456',
   *   user: { 
   *     id: 'user-789', 
   *     name: 'John Doe', 
   *     email: 'john@example.com',
   *     avatar: 'https://example.com/avatar.jpg'
   *   },
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
      features: {
        livestreaming: isCoach,
        recording: isCoach,
        transcription: isCoach,
        'screen-sharing': true,
        'file-upload': true,
        'send-groupchat': true,
        'create-polls': isCoach,
      },
    });
  }

  /**
   * Get configuration status
   * @returns {Object} Configuration status
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      domain: this.domain,
      hasAppId: !!this.appId,
      hasPrivateKey: !!this.privateKey,
      hasKid: !!this.kid,
      signupUrl: 'https://jaas.8x8.vc/',
    };
  }
}

// Export singleton instance
module.exports = new JitsiJaaSService();

