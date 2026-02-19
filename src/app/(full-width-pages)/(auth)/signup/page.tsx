import SignUpForm from "@/components/auth/SignUpForm";
import { getBusinessCategories } from "@/service/businessService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | Schedullin - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page Schedullin Dashboard Template",
};

export default async function SignUp() {
  const categories = await getBusinessCategories();
  return <SignUpForm categories={categories} />
}
