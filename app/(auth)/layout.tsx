import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/learnlogo.png";

export default function Authlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft />
        <Label>Back</Label>
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center self-center gap-2 font-medium"
        >
          <Image src={Logo} alt="logo" width={110} height={110} />
          LearnMM - Myanmar
        </Link>
        {children}

        <div className="text-balance text-center text-xs text-muted-foreground">
          By Clicking Continue, you agree to our{" "}
          <span className="underline hover:text-primary">
            {" "}
            Terms of Services
          </span>{" "}
          and{" "}
          <span className="underline hover:text-primary">Privacy Policy</span>.
        </div>
      </div>
    </div>
  );
}
