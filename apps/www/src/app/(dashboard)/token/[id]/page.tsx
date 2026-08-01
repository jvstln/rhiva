"use client";

import { useParams } from "next/navigation";

import { useToken } from "@/features/market/market.hook";
import { QueryState } from "@/components/layout/QueryState";
import { TokenDetailPage } from "@/features/market/components/TokenDetailPage";

export default function TokenDetailRoute({ params }: PageProps<"/token/[id]">) {
  // const { id } = await params;
  // const token = await getToken(id);
  const { id } = useParams();
  const token = useToken(id as string);

  return (
    <QueryState query={token}>
      {(token) => <TokenDetailPage token={token.data} />}
    </QueryState>
  );
}
