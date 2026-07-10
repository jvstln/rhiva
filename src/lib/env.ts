import z from "zod";

const EnvSchema = z
  .object({
    APP_NAME: z.string().default("Rhiva"),
    APP_ORIGIN: z.url().default("https://rhiva.fun"),
    BIRDEYE_API_KEY: z.string(),
    ENV: z.string().default("development"),
  })
  .catch((error) => {
    throw new Error(
      `Invalid environment variables: ${error.issues.map((iss) => iss.message).join(",")}`,
    );
  });

export const env = EnvSchema.parse({
  APP_NAME: process.env.APP_NAME,
  APP_ORIGIN: process.env.APP_ORIGIN,
  BIRDEYE_API_KEY: process.env.NEXT_PUBLIC_BIRDEYE_API_KEY,
  ENV: process.env.NEXT_PUBLIC_ENV,
});
