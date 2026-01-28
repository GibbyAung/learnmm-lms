"use client";
import {
  BookOpen,
  ChevronDownIcon,
  Home,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface isAppPros {
  name: string;
  email: string;
  image: string;
}

export default function UserDropDown({ email, name, image }: isAppPros) {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
          toast.success("Signed out successfully.");
        },
        onError: () => {
          toast.error("Failed to sign out.");
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt="Profile image" src={image} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            aria-hidden="true"
            className="opacity-60"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            {name}
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <Home aria-hidden="true" className="opacity-60" size={16} />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/courses">
              <BookOpen aria-hidden="true" className="opacity-60" size={16} />
              <span>Courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard
                aria-hidden="true"
                className="opacity-60"
                size={16}
              />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
