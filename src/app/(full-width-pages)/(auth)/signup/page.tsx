import SignUpForm from "@/components/auth/SignUpForm";
import { getBusinessCategories } from "@/service/businessService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Start your free journey with Schedullin. Set up your professional booking page in minutes.",
};

export default async function SignUp() {
  const categories = await getBusinessCategories();
  return <SignUpForm categories={categories} />
}
