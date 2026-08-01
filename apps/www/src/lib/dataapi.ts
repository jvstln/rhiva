import { DataApiClient } from "@rhivadotfun/dataapi";

import { env } from "./env";

export const dataapi = new DataApiClient({ baseUrl: env.dataApiUrl });
