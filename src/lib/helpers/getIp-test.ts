'use server';
import { headers } from 'next/headers';
import { ratelimit } from './rate-limit';

export const getIpAddress = async () => {
  const forwardedFor = headers().get('x-forwarded-for');
  const realIp = headers().get('x-real-ip');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIp) {
    return realIp.trim();
  }
  return null;
};
