import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

// Dev-only helper endpoint to serve the local Breakout scrape.
// This avoids copying the large JSON into src/ while keeping everything local.
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'breakout-local', 'breakout-data.json');
    const raw = await readFile(filePath, 'utf-8');
    return new NextResponse(raw, {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        // Prevent caching while iterating locally.
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Failed to read breakout-local/breakout-data.json',
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}

