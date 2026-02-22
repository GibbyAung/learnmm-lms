import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import { v4 as uuidv4 } from "uuid";
import arcject, { fixedWindow } from "@/lib/arcject";
import { requireAdmin } from "@/app/data/admin/require-admin";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required." }),
  contentType: z.string().min(1, { message: "Content type is required." }),
  size: z.coerce.number<number>().min(1, { message: "Size is required." }),
  isImage: z.boolean(),
});

const aj = arcject.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function POST(req: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Not cool at all bro, not cool " },
        { status: 429 },
      );
    }

    const body = await req.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(JSON.stringify(validation.error.issues), {
        status: 400,
      });
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
      ChecksumAlgorithm: undefined,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, //url expires in 6 mins
      unhoistableHeaders: new Set(["x-amz-checksum-crc32"]),
    });

    const response = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate pre-signed URL",
      },
      {
        status: 500,
      },
    );
  }
}
