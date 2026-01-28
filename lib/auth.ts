import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const { data, error } = await resend.emails.send({
          from: "LearnMM <onboarding@resend.dev>",
          to: [email],
          subject: "LearnMM - Verification your email",
          html: `<p>Your verification code is <b>${otp}</b></p>`,
        });
      },
    }),
  ],
});
