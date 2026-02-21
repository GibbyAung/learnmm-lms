// app/payment/success/page.tsx
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { requiredUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default async function PaymentSuccessPage() {
  const user = await requiredUser();

  // Grab the most recent enrollment for this user.
  // This works well when your webhook flips Pending -> Active.
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      course: {
        select: {
          title: true,
          slug: true,
          smallDescription: true,
          level: true,
          category: true,
          duration: true,
          price: true,
        },
      },
    },
  });

  const course = enrollment?.course ?? null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-7 w-7" />
            <div className="space-y-1">
              <CardTitle className="text-2xl">Payment successful</CardTitle>
              <CardDescription>
                Your order is complete. You can start learning right away.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!enrollment || !course ? (
            <Alert>
              <AlertTitle>Purchase confirmed</AlertTitle>
              <AlertDescription>
                We couldn’t load your course details yet (this can happen if the
                webhook is still processing). Refresh in a moment, or go to your
                dashboard to see your enrolled courses.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Unlocked course</CardTitle>
                <CardDescription>
                  Enrollment status: {enrollment.status}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xl font-semibold">{course.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {course.smallDescription}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="secondary">{course.duration}h</Badge>
                    <Badge variant="outline">{money(course.price)}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/courses/${course.slug}`}>
                      Go to course <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/dashboard">Go to dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground">
            If you don’t see your course immediately, it usually means the
            payment webhook is still updating your enrollment.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
