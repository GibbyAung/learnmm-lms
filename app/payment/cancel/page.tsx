// app/payment/cancel/page.tsx
import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <XCircle className="h-7 w-7" />
            <div className="space-y-1">
              <CardTitle className="text-2xl">Payment cancelled</CardTitle>
              <CardDescription>
                Nothing was charged. You can try again anytime.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertTitle>Want to continue?</AlertTitle>
            <AlertDescription>
              Go back to the course page and start checkout again when you’re
              ready.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back home
              </Link>
            </Button>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
