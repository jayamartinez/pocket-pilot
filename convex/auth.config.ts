import type { AuthConfig } from "convex/server";

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function getClerkIssuerDomain() {
  const frontendApiUrl = process.env.CLERK_FRONTEND_API_URL?.trim();
  if (frontendApiUrl) {
    return frontendApiUrl.startsWith("http")
      ? frontendApiUrl
      : `https://${frontendApiUrl}`;
  }

  const explicitDomain = process.env.CLERK_JWT_ISSUER_DOMAIN?.trim();
  if (explicitDomain) {
    return explicitDomain.startsWith("http")
      ? explicitDomain
      : `https://${explicitDomain}`;
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  if (!publishableKey) {
    throw new Error(
      "Missing Clerk issuer configuration. Set CLERK_FRONTEND_API_URL, CLERK_JWT_ISSUER_DOMAIN, or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY before deploying Convex auth.",
    );
  }

  const parts = publishableKey.split("_");
  if (parts.length < 3) {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not in the expected Clerk format.");
  }

  const encodedDomain = parts.slice(2).join("_");
  const decodedDomain = decodeBase64Url(encodedDomain).replace(/\$/g, "");

  if (!decodedDomain) {
    throw new Error("Unable to derive the Clerk issuer domain from NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.");
  }

  return decodedDomain.startsWith("http")
    ? decodedDomain
    : `https://${decodedDomain}`;
}

export default {
  providers: [
    {
      domain: getClerkIssuerDomain(),
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
