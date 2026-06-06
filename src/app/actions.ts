"use server";

import { db } from "@/db";
import { emailSignups } from "@/db/schema";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupState = {
  success?: boolean;
  message?: string;
  email?: string;
};

export async function subscribe(
  _previousState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      email,
    };
  }

  try {
    await db.insert(emailSignups).values({ email }).onConflictDoNothing();

    return {
      success: true,
      message: "Thanks! I'll email you with more details soon.",
      email: "",
    };
  } catch (error) {
    console.error("Failed to save email signup", error);
    return {
      success: false,
      message: "Unable to save your email right now. Please try again.",
      email,
    };
  }
}
