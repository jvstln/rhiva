import z from "zod";

const envSchema = z.object({
  privyAppId: z.string(),
  solanaRpcUrl: z.string(),
  privySignerId: z.string(),
  appName: z.string().default("Rhiva"),
  env: z.string().default("development"),
  appOrigin: z.url().default("https://alpha.rhiva.fun"),
  userApiUrl: z.string().default("https://api.rhiva.fun"),
  dataApiKey: z.string(),
  dataApiUrl: z.string().default("https://dataapi.rhiva.fun"),
  webSocketApiUrl: z.string().default("wss://dataapi.rhiva.fun/ws"),
});

export const env = envSchema.parse({
  env: process.env.NODE_ENV,
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  appOrigin: process.env.NEXT_PUBLIC_APP_ORIGIN,
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  privySignerId: process.env.NEXT_PUBLIC_PRIVY_SIGNER_ID,
  solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  userApiUrl: process.env.NEXT_PUBLIC_USER_API_URL,
  dataApiKey: process.env.NEXT_PUBLIC_DATA_API_KEY,
  dataApiUrl: process.env.NEXT_PUBLIC_DATA_API_URL,
  webSocketApiUrl: process.env.NEXT_PUBLIC_WS_API_URL,
});
