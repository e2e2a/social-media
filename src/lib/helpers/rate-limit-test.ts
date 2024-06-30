'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

type RequestCounts = Map<string, { ip: string; count: number; expirationTime: number }>;
const requestCounts: RequestCounts = new Map();

const maxRequestsPerDevice = 3;
const expirationTimeMs = 60 * 1000; // 1 minute

export default async function rateLimit(req: NextRequest) {
  const cookieStore = cookies();
  let uniqueId = cookieStore.get('uniqueId')?.value;

  if (!uniqueId) {
    uniqueId = uuidv4(); // Generate a new UUID if not found in cookies
    NextResponse.next().cookies.set({
      name: 'uniqueId',
      value: uniqueId,
      path: '/sign-in',
    });
  }

  console.log('Device Unique ID:', uniqueId);

  // Retrieve client IP address using x-forwarded-for header or similar
  const clientIpAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip');
  const ip = clientIpAddress || 'unknown';

  const currentTime = Date.now();

  // Clean up expired entries
  for (const [key, value] of requestCounts.entries()) {
    if (value.expirationTime <= currentTime) {
      requestCounts.delete(key);
    }
  }

  const requestData = requestCounts.get(uniqueId);

  if (requestData) {
    // Check if the IP address matches
    if (requestData.ip !== ip) {
      return { error: 'IP address mismatch. Try again later.' };
    }

    if (requestData.count >= maxRequestsPerDevice) {
      return { error: 'Too many requests. Try again later.' };
    }
    requestData.count++;
  } else {
    requestCounts.set(uniqueId, { ip: ip, count: 1, expirationTime: currentTime + expirationTimeMs });

    // Set a timeout to clean up the entry
    setTimeout(() => {
      requestCounts.delete(uniqueId);
    }, expirationTimeMs);
  }

  return { uniqueId, requestCounts };
}
