"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcject, { fixedWindow } from "@/lib/arcject";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ApiReponse } from "@/lib/types";
import { CourseScehmaType, courseSchema } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function CreateCourse(
  value: CourseScehmaType,
): Promise<ApiReponse> {
  const session = await requireAdmin();

  const aj = arcject.withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    }),
  );

  try {
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: session?.user.id,
    });

    if (!decision.isAllowed) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      }
      return {
        status: "error",
        message:
          "You look like a bot, if it's a mistake please contact support",
      };
    }

    const validation = courseSchema.safeParse(value);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    const transformedData = {
      ...validation.data,
      level: validation.data.level.toUpperCase() as
        | "BEGINNER"
        | "INTERMEDIATE"
        | "ADVANCED",
      status: validation.data.status.toUpperCase() as
        | "PUBLISHED"
        | "DRAFT"
        | "ARCHIVED",
      userId: session?.user.id as string,
    };

    const data = await stripe.products.create({
      name: transformedData.title,
      description: transformedData.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: transformedData.price * 100,
      },
    });

    await prisma.course.create({
      data: { ...transformedData, stripePriceId: data.default_price as string },
    });

    return {
      status: "success",
      message: "Created Course Successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create a course.",
    };
  }
}
