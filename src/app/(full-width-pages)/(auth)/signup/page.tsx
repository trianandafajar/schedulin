import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | maketime",
  description: "Create your maketime account to launch your booking page and automate scheduling.",
};

export default async function SignUp() {
  const baseUrl = process.env.NEXT_PUBLIC_URL_API || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/business/categories`, { cache: "no-store" });
  const categories = response.ok ? await response.json() : [];
  return <SignUpForm categories={categories} />
}
