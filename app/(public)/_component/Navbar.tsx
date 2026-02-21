"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import UserDropDown from "./UserDropDown";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigationList = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-5 lg:px-8">
        <Link href="/" className="flex items-center mr-4 space-x-2">
          <Image src="/learnlogo.png" alt="logo" width={80} height={80} />
          <span className="font-bold">LearnMM.</span>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-2.5">
            {navigationList.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isPending ? null : session ? (
              <UserDropDown
                email={session.user.email}
                name={
                  session?.user.name && session.user.name.length > 0
                    ? session.user.name
                    : session?.user.email.split("@")[0]
                }
                image={
                  session?.user.image ||
                  `https://avatar.vercel.sh/${session?.user.email}`
                }
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "default" })}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Nav */}
      </div>
    </header>
  );
};

export default Navbar;
