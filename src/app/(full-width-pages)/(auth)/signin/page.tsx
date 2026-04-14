import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Maketime",
  description: "Sign in to Maketime and manage bookings, calendars, and appointment operations.",
};

export default function SignIn() {
  return <SignInForm />;
}
