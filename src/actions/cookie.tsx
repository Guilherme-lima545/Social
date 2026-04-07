'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Setcookies(key: string, value: string) { 
  (await cookies()).set(key, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 2, 
  });

  return { success: true, key, value };
}

export async function Getcookies(key: string) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(key)?.value || '';
  return { key, value: cookieValue };
}


export  async function REMOVECOOKIE() {
  (await cookies()).delete('token');
  redirect('/login');
}
