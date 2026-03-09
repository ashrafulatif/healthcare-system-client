/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined in environment variables",
  );
}

export const getNewTokensWithRefreshToken = async (
  refreshToken: string,
): Promise<boolean> => {
  //call refresh token api
  const res = await fetch(`${BASE_API_URL}/auth//refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${refreshToken}`,
    },
  });
  try {
    if (res.ok) {
      return false;
    }

    const { data } = await res.json();

    //destructure new tokens from response
    const { accessToken, refreshToken: newRefreshToken, token } = data;

    //set new token in cookies
    if (accessToken) {
      await setTokenInCookies("accessToken", accessToken);
    }

    if (newRefreshToken) {
      await setTokenInCookies("refreshToken", newRefreshToken);
    }

    if (token) {
      await setTokenInCookies("better-auth.session_token", token, 60 * 60 * 24);
    }

    return true;
  } catch (error: any) {
    console.error("Error refreshing tokens:", error);
    return false;
  }
};

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }
    const { data } = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
