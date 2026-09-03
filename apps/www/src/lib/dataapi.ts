import DataApi from "@rhivadotfun/dataapi";

import { env } from "./env";

export const dataapi = new DataApi({
  baseURL: env.dataApiUrl,
  apiKey: env.dataApiKey,
});
