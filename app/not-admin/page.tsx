"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  Home,
  ArrowLeft,
  Lock,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AccessDenied() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  // Animated lock icons floating in background
  const floatingLocks = [
    { delay: "0s", duration: "20s", left: "10%", top: "20%" },
    { delay: "2s", duration: "25s", left: "80%", top: "30%" },
    { delay: "4s", duration: "22s", left: "20%", top: "70%" },
    { delay: "1s", duration: "23s", left: "70%", top: "60%" },
  ];

  const handleAutoRedirect = () => {
    setShowCountdown(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-destructive/5 p-4 relative overflow-hidden">
      {/* Floating Lock Icons Background */}
      {floatingLocks.map((lock, index) => (
        <div
          key={index}
          className="absolute opacity-5 pointer-events-none animate-float"
          style={{
            left: lock.left,
            top: lock.top,
            animationDelay: lock.delay,
            animationDuration: lock.duration,
          }}
        >
          <Lock className="w-16 h-16 text-destructive" />
        </div>
      ))}

      <Card className="w-full max-w-2xl shadow-2xl border-2 border-destructive/20 relative z-10">
        <CardHeader className="border-b bg-destructive/5 pb-4">
          <div className="flex items-center justify-center gap-3">
            <Badge
              variant="destructive"
              className="px-4 py-1 text-sm font-semibold"
            >
              ACCESS RESTRICTED
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-8 pb-10 px-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Animated Shield Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative bg-destructive/10 rounded-full p-6 border-4 border-destructive/30 animate-bounce-slow">
                <ShieldAlert
                  className="w-24 h-24 text-destructive"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-destructive tracking-tight flex items-center justify-center gap-3">
                <Lock className="w-10 h-10" />
                Access Denied
              </h1>
              <div className="h-1 w-32 bg-linear-to-r from-transparent via-destructive to-transparent mx-auto rounded-full"></div>
            </div>

            {/* Alert Box */}
            <Alert variant="destructive" className="max-w-md border-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="text-left ml-2">
                <strong>Administrator Access Required</strong>
                <br />
                You don't have permission to access this area of the Learning
                Management System.
              </AlertDescription>
            </Alert>

            {/* Description */}
            <div className="space-y-3 max-w-lg">
              <p className="text-muted-foreground text-base leading-relaxed">
                This section is restricted to administrators only. If you
                believe you should have access, please contact your system
                administrator or course coordinator.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Need help?</strong> Check
                  your user role in your profile settings or reach out to
                  support for assistance.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full sm:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/courses" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Browse Courses
                </Link>
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>

              {!showCountdown && (
                <>
                  <span className="text-muted-foreground text-sm">or</span>
                  <Button
                    variant="ghost"
                    onClick={handleAutoRedirect}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Redirect to home
                  </Button>
                </>
              )}
            </div>

            {/* Countdown Timer */}
            {showCountdown && (
              <div className="mt-2 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  Redirecting to home in{" "}
                  <span className="font-bold text-foreground">{countdown}</span>{" "}
                  seconds...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
