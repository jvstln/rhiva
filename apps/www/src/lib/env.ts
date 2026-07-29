import z from "zod";

const EnvSchema = z
  .object({
    APP_NAME: z.string().default("Rhiva"),
    APP_ORIGIN: z.url().default("https://rhiva.fun"),
    PRIVY_APP_ID: z.string(),
    ENV: z.string().default("development"),
    PRIVY_SIGNER_ID: z.string(),
  })
  .catch((error) => {
    throw new Error(
      `Invalid environment variables: ${error.issues.map((iss) => iss.message).join(",")}`,
    );
  });

export const env = EnvSchema.parse({
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  APP_ORIGIN: process.env.NEXT_PUBLIC_APP_ORIGIN,
  PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  PRIVY_SIGNER_ID: process.env.NEXT_PUBLIC_PRIVY_SIGNER_ID,
  ENV: process.env.NEXT_PUBLIC_ENV,
});
