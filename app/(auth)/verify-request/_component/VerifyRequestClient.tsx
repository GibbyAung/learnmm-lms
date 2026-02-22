"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const VerifyRequest = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startTransition] = useTransition();
  const params = useSearchParams();
  const isOtpCompleted = otp.length === 6;

  const email = params.get("email") as string;

  function verifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully.");
            router.push("/");
          },
          onError: () => {
            toast.error("Error verifying email. Please try again.");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Please Check Your Inbox</CardTitle>
        <CardDescription>
          We have sent a verification code to your email.
        </CardDescription>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <p className="text-sm text-muted-foreground">
              Please enter the verification code you received in your email to
              continue.
            </p>
          </div>

          <Button
            onClick={verifyOtp}
            disabled={emailPending || !isOtpCompleted}
            className="w-full"
          >
            {emailPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                <span className="sr-only">Verifying...</span>
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default VerifyRequest;
