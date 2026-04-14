import Image from "next/image";
import React from "react";

export default function HeroIllustration() {
  return (
    <Image
      src="/demo-illustration-2.svg"
      alt="Hero Illustration"
      width={1200}
      height={800}
      className="w-full h-auto drop-shadow-2xl"
      priority
    />
  );
}