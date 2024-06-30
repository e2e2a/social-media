import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getIpAddress } from './getIp-test';

const trackers: Record<string, { count: number; expiresAt: number }> = {};

const maxRequestsPerDevice = 3;
const expirationTimeMs = 60 * 1000; // 1 minute

export default async function rateLimit(limit: number = 3) {
  let uniqueId = headers().get('uniqueId') || uuidv4();
  const ip = await getIpAddress();
  console.log(ip);
  const currentTime = Date.now();
  if (!ip) {
    throw new Error('IP address not found.');
  }
  const tracker = trackers[ip] || { count: 0, expiresAt: 0 };
  console.log('tracker', tracker);
  if (!trackers[ip]) {
    trackers[ip] = tracker;
  }

  if (tracker.expiresAt < currentTime) {
    tracker.count = 0;
    tracker.expiresAt = currentTime + expirationTimeMs;
  }
  tracker.count++;
  if (tracker.count > limit) {
    throw new Error('Rate Limit exceeded.');
  }
}
