import { requireAdmin } from "@/app/data/admin/require-admin";
import arcject, { fixedWindow } from "@/lib/arcject";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { PutObjectAclCommand } from "@aws-sdk/client-s3";
import { error } from "console";

import { NextResponse } from "next/server";

const aj = arcject.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Not cool at all bro, not cool " },
        { status: 429 },
      );
    }

    const body = await request.json();

    const key = body.key;

    if (!key) {
      return NextResponse.json(
        {
          error: "Missing an invalid Object key",
        },
        { status: 400 },
      );
    }

    const command = new PutObjectAclCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    try {
      await S3.send(command);

      return NextResponse.json(
        { message: "File deleted successfully" },
        { status: 200 },
      );
    } catch (error: any) {
      // ✅ Handle NoSuchKey - file already gone, that's OK!
      if (error.name === "NoSuchKey" || error.Code === "NoSuchKey") {
        return NextResponse.json(
          { message: "File already deleted or doesn't exist" },
          { status: 200 }, // ← Still return 200, goal achieved
        );
      }
    }

    throw error;
  } catch {
    return NextResponse.json(
      {
        error: "Missing an invalid Object key",
      },
      { status: 500 },
    );
  }
}
