"use client";

import axios from "@/app/utils/axios";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";

export const useAuthService = () => {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const { signOut } = useClerk();

  const login = async (email: string, password: string) => {
    if (!isSignInLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        return { success: true };
      } else {
        return { success: false, error: "Login incomplete (MFA required?)" };
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      return { success: false, error: err.errors?.[0]?.message || err.message };
    }
  };

const register = async (email: string, password: string, firstName: string, lastName: string) => {
    if (!isSignUpLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName, 
        lastName,  
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.errors?.[0]?.message || err.message };
    }
  };

  const verifyEmail = async (code: string) => {
    if (!isSignUpLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        // await setActive({ session: result.createdSessionId });
       
        return { 
          success: true, 
          userId: result.createdUserId, 
          email: result.emailAddress 
        };
      } else {
        return { success: false, error: "Verification incomplete" };
      }
    } catch (err: any) {
      return { success: false, error: err.errors?.[0]?.message || err.message };
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirectUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    login,
    register,
    verifyEmail,
    logout,
    isLoaded: isSignInLoaded && isSignUpLoaded,
  };
};

export const completeOnboardingClient = async (
  businessName: string,
  categoryId: string,
  userId: string,
  userEmail: string,
  userFullName: string
) => {
  const response = await axios('/api/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      businessName,
      categoryId,
      userId,
      email: userEmail,       
      fullName: userFullName, 
    }),
  });

  const result = response.data;

  if (response.status != 200) {
    throw new Error(result.error || 'Gagal melakukan onboarding');
  }

  return result;
};