"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { completeOnboarding } from "@/actions/auth";
import Button from "../ui/button/Button";

type Step = 'signup' | 'onboarding' | 'verify';

interface SignUpFormProps {
  categories: { id: string; name: string }[];
}

export default function SignUpForm({ categories }: SignUpFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<Step>('signup');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [code, setCode] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setIsLoading(true);

    if (!isChecked) {
      setError("Please agree to the Terms and Conditions");
      setIsLoading(false);
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setStep('onboarding');
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!businessName || !categoryId) {
      setError("Please fill in all business details.");
      return;
    }
    setStep('verify');
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        const userId = completeSignUp.createdUserId || signUp.createdUserId;

        const userEmail = completeSignUp.emailAddress || email;
        const userFullName = `${firstName} ${lastName}`.trim();

        if (!userId) {
          console.error("Critical Error: User ID is missing after signup", { completeSignUp, signUp });
          setError("Account verified but User ID missing. Please refresh and login.");
          setIsLoading(false);
          return;
        }

        const result = await completeOnboarding(
          businessName,
          categoryId,
          userId,
          userEmail,
          userFullName
        );
        if (result.error) {
          setError("Account created but business setup failed. Please contact support.");
        } else {
          router.push("/");
        }
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setError("Verification code incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeftIcon /> Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        {step === 'onboarding' && (
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Setup Business
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please provide your business details before verifying your account.
              </p>
            </div>

            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

            <form onSubmit={handleOnboardingNext}>
              <div className="space-y-5">
                <div>
                  <Label>Business Name<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    placeholder="e.g. Barber King"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Category<span className="text-error-500">*</span></Label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="relative z-20 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600">
                  Next: Verify Email
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'verify' && (
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Verify Email</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">We sent a code to <strong>{email}</strong>.</p>
            </div>
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

            <form onSubmit={handleVerification}>
              <div className="space-y-5">
                <div>
                  <Label>Verification Code</Label>
                  <Input
                    type="text"
                    placeholder="OTP"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Setting up..." : "Verify & Complete"}
                </Button>
                <div className="text-center mt-4">
                  <button
                    className="text-sm text-gray-500"
                    type="submit"
                    onClick={() => setStep('onboarding')}
                  >
                    Back
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {step === 'signup' && (
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 sm:text-title-md">Sign Up</h1>
            </div>
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={firstName}
                      placeholder="Enter your first name"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={lastName}
                      placeholder="Enter your last name"
                      onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <p className="text-sm text-gray-500">I agree to Terms & Conditions</p>
                </div>
                <div id="clerk-captcha"></div>
                <Button className="w-full" size="sm" type="submit" disabled={isLoading} >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </div>
            </form>
            <div className="mt-5 text-center">
              <p className="text-sm">Already have an account? <Link href="/signin" className="text-brand-500">Sign In</Link></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}