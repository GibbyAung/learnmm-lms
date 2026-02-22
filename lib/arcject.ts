import arcjet, {
  detectBot,
  fixedWindow,
  sensitiveInfo,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { env } from "./env";

export {
  detectBot,
  fixedWindow,
  sensitiveInfo,
  protectSignup,
  shield,
  slidingWindow,
};

export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});
