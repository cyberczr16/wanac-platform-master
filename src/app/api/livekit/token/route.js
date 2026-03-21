import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

// Server-side route to issue LiveKit access tokens for a given room.
// Uses LIVEKIT_API_KEY / LIVEKIT_API_SECRET from environment variables.
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const roomName = url.searchParams.get('roomName');
    const userId =
      url.searchParams.get('userId') ||
      (typeof request.headers.get === 'function' && request.headers.get('x-user-id')) ||
      'anonymous';
    const userName = url.searchParams.get('userName') || 'Participant';

    if (!roomName) {
      return NextResponse.json({ error: 'Missing roomName' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      return NextResponse.json(
        {
          error: 'LiveKit is not configured on the server',
          missing: {
            LIVEKIT_API_KEY: !apiKey,
            LIVEKIT_API_SECRET: !apiSecret,
            NEXT_PUBLIC_LIVEKIT_URL: !livekitUrl,
          },
        },
        { status: 500 },
      );
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: String(userId),
      name: String(userName),
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json(
      {
        token,
        url: livekitUrl,
        roomName,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Failed to generate LiveKit token',
        message: err?.message || String(err),
      },
      { status: 500 },
    );
  }
}

