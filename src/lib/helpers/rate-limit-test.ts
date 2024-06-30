"use server";

type IPRequestCounts = Map<string, { count: number; expirationTime: number }>;
const ipRequestCounts: IPRequestCounts = new Map();

const maxRequestsPerIP = 3;
const expirationTimeMs = 60 * 1000; // 1 minute

export default async function rateLimit(headers: Headers) {
  const ip = getClientIP(headers);
  if (!ip) {
    throw new Error('IP address not found in headers.');
  }

  console.log('User IP:', ip);

  const currentTime = Date.now();

  // Clean up expired IP entries
  for (const [key, value] of ipRequestCounts.entries()) {
    if (value.expirationTime <= currentTime) {
      ipRequestCounts.delete(key);
    }
  }

  const ipData = ipRequestCounts.get(ip);

  if (ipData) {
    if (ipData.count >= maxRequestsPerIP) {
      return { error: 'Too many requests. Try again later.' };
    }
    ipData.count++;
  } else {
    ipRequestCounts.set(ip, { count: 1, expirationTime: currentTime + expirationTimeMs });

    // Set a timeout to clean up the IP entry
    setTimeout(() => {
      ipRequestCounts.delete(ip);
    }, expirationTimeMs);
  }

  return { ip, ipRequestCounts };
}

function getClientIP(headers: Headers): string | null {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can return a comma-separated list of IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  // Fallback to remote address or any other logic you need to obtain the IP
  return headers.get('remote-addr') || null;
}
