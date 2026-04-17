import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Schedullin account to manage your bookings.",
};

export default function SignIn() {
  return <SignInForm />;
}
