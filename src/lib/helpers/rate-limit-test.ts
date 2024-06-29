"use server"
type IPRequestCounts = Map<string, { count: number; expirationTime: number }>;
const ipRequestCounts: IPRequestCounts = new Map();

const maxRequestsPerIP = 3;
const expirationTimeMs = 60 * 1000;
export default async function rateLimit(ip:string) {
  // const ip = headers().get('x-forwarded-for');
  // const ip = '192.168.0.1';
  console.log('user ip', ip);

  // Check if the IP address exists and is not null
  if (ip) {
    // Check if the IP address exists in the request counts map
    if (ipRequestCounts.has(ip)) {
      const ipData = ipRequestCounts.get(ip);
      

      // Check if the IP has exceeded the maximum number of requests
      if (ipData && ipData.count >= maxRequestsPerIP) {
        return {error: 'Too many requests. Try again tomorrow.'}
      }

      // Increment the request count for this IP
      ipData && ipData.count++;
    } else {
      // If the IP address doesn't exist in the map, initialize it with a count of 1 and an expiration time
      ipRequestCounts.set(ip, { count: 1, expirationTime: Date.now() + expirationTimeMs });

      // Set a timeout to delete the IP entry after 1 minute
      setTimeout(() => {
        ipRequestCounts.delete(ip);
      }, expirationTimeMs);
    }
  } else {
    throw new Error('IP address not found in headers.'); // Handle the case where IP is null
  }

  return {ip, ipRequestCounts};
}
