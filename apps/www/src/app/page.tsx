import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Rhiva | Liquidity Aggregator for seamless LP",
  description:
    "Experience Rhiva Beta, the all-in-one liquidity aggregator. Provide liquidity across multiple dexes.",
};

export default function Home() {
  redirect("/market");
}
