import Image from "next/image";

export default function HeroIllustration() {
  return (
    <Image
      src="/demo-illustration-2.svg"
      alt="Hero Illustration"
      width={160}
      height={160}
      className="w-40 h-40"
    />
  );
}