"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  //parse payload using zod schema
  const parsePayload = loginZodSchema.safeParse(payload);
  if (!parsePayload.success) {
    const firstError = parsePayload.error.issues[0].message || "Invalid input";

    return {
      success: false,
      message: firstError,
    };
  }
  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsePayload.data,
    );

    //set in token in cookies
    const { accessToken, refreshToken, token, user } = response.data;

    const { role, emailVerified, needPasswordChange, email } = user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token);

    if (needPasswordChange) {
      redirect(`/reset-password?email=${email}`);
    } else {
      const targetPath =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);

      redirect(targetPath);
    }
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error; // Re-throw the redirect error to be handled by Next.js
    }

    if (
      error &&
      error.response &&
      error.response.data === "Email not verified"
    ) {
      redirect(`/verify-email?email=${payload.email}`);
    }

    return {
      success: false,
      message: `Login failed: ${error.message}`,
    };
  }
};
