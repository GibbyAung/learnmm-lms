"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, Loader, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  async function signinWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Signed in with Github successfully. You will be redirected...."
            );
          },
          onError: () => {
            toast.error("Something went wrong. Please try again.");
          },
        },
      });
    });
  }

  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent successfully. Please check your inbox.");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Something went wrong. Please try again.");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Sign in to your account.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={signinWithGithub}
          disabled={githubPending}
        >
          {githubPending ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Sign in with Github
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>

          <Button onClick={signInWithEmail} disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Sign in with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
