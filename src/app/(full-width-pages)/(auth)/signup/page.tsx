import { getBusinessCategories } from "@/actions/auth";
import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
};

export default async function SignUp() {
  const categories = await getBusinessCategories();
  return <SignUpForm categories={categories} />
}
