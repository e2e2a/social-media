"use server"
import { headers } from "next/headers";
import { ratelimit } from "./rate-limit";


export const getIpAddress = async() => {
    const headersList = headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ?? "127.0.0.1"
    console.log(ip)
    const {success, pending, limit, reset, remaining} = await ratelimit.limit(ip)
    return {success, pending, limit, reset, remaining}
}