"use server";

import { freePantryScan, proRateLimit } from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";
import { request } from "@arcjet/next";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_UR || "http://localhost:1337";
const strapiApiToken = process.env.STRAPI_API_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function scanPantryImage(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const isPro = user.subscription === "pro";

    // Appy Arcjet rate limit based on tier
    const arcjetClient = isPro ? proRateLimit : freePantryScan;

    // Create a request object for Arcjet
    const req = await request();

    const decision = await arcjetClient.protect(req, {
      userId: user.clerkId,
      requested: 1,
    });

    if (decision.isDenied) {
      if (decision.reason.isRateLimit) {
        throw new Error(
          `Monthly scan limit reacched. ${
            isPro
              ? "Please contact support if you need more scans."
              : "Upgrade to Pro for unlimited scans!"
          }`,
        );
      }

      throw new Error("Request denied by security system");
    }
  } catch (error) {}
}
