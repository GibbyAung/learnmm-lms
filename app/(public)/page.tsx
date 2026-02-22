"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { BookOpen, LayoutDashboard, PartyPopper, Trophy } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session } = authClient.useSession();

  const features = [
    {
      title: "Comprehensive Course Catalog",
      description: "Discover a vast selection of courses from top instructors.",
      icon: <BookOpen size={24} />,
    },
    {
      title: "Interactive Learning Experience",
      description: "Engage in interactive lessons, quizzes, and assignments.",
      icon: <PartyPopper size={24} />,
    },
    {
      title: "Personalized Learning Progress",
      description: "Monitor your learning journey and track your progress.",
      icon: <LayoutDashboard size={24} />,
    },
    {
      title: "Progress Tracking and Certificates",
      description: "Track your learning progress and earn certificates.",
      icon: <Trophy size={24} />,
    },
  ];

  return (
    <div>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">The Future of Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your Learning Experience
          </h1>
          <p className="max-w-175 text-muted-foreground md:text-xl">
            Discover a new way to learn and grow with our modern learning
            platform
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Link className={buttonVariants({ size: "lg" })} href="/courses">
              Explore Courses{" "}
            </Link>
            <Link
              className={
                session
                  ? "hidden"
                  : buttonVariants({ size: "lg", variant: "outline" })
              }
              href="/courses"
            >
              Sign in{" "}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 lg:grid-col-6 gap-6 px-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col gap-6 align-center justify-center">
              {feature.icon}
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
