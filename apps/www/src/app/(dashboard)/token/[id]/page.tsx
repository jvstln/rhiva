"use client";

import { useParams } from "next/navigation";

import { useToken } from "@/features/market/market.hook";
import { QueryState } from "@/components/layout/QueryState";
import { TokenDetailPage } from "@/features/market/components/TokenDetailPage";

export default function TokenDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const token = useToken(id);

  return (
    <QueryState query={token}>
      {(token) => <TokenDetailPage token={token.data} />}
    </QueryState>
  );
}
