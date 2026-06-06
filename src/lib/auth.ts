import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import type { OAuth2Tokens } from "better-auth";
import { betterAuth } from "better-auth/minimal";
import { genericOAuth } from "better-auth/plugins";
import { db } from "@/db";

const hackClubClientId = process.env.HACKCLUB_CLIENT_ID ?? "";
const hackClubClientSecret = process.env.HACKCLUB_CLIENT_SECRET ?? "";

export const auth = betterAuth({
  appName: "Breadboard",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["hackclub"],
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "hackclub",
          discoveryUrl:
            "https://auth.hackclub.com/.well-known/openid-configuration",
          clientId: hackClubClientId,
          clientSecret: hackClubClientSecret,
          scopes: [
            "openid",
            "profile",
            "email",
            "slack_id",
            "verification_status",
          ],
          pkce: true,
          async getUserInfo(tokens: OAuth2Tokens) {
            const res = await fetch(
              "https://auth.hackclub.com/oauth/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              },
            );
            const raw = (await res.json()) as Record<string, unknown>;
            return {
              id: String(raw.sub ?? raw.id ?? ""),
              name: String(raw.name ?? raw.nickname ?? ""),
              email: String(raw.email ?? ""),
              emailVerified: Boolean(raw.email_verified),
            };
          },
        },
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
