import axios from "axios";

export const api = axios.create({
  baseURL: "https://dataapi.rhiva.fun",
});
