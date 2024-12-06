"use server";
 
import { auth } from "@/auth";
import { headers } from "next/headers";
 
export const protectedAction = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    console.log(session)
};