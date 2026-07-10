import axios from "axios";

export const api = axios.create({
  baseURL: "https://public-api.birdeye.so",
  headers: {
    "X-Api-Key": process.env.BIRDEYE_API_KEY,
  },
});
