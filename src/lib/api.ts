import axios from "axios";
import { env } from "./env";

export const api = axios.create({
  baseURL: "https://public-api.birdeye.so",
  headers: {
    "X-Api-Key": env.BIRDEYE_API_KEY,
    "x-chain": "solana",
  },
});
