import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useConnection } from "@solana/wallet-adapter-react";
import { wallet } from "@/queries";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks";

type TokenSelectProps<Value> = Select.Props<Value>;

export function TokenSelect<Value>({ ...props }: TokenSelectProps<Value>) {
  const { connection } = useConnection();
  const auth = useAuth();

  const balances = useQuery(
    wallet.tokens.queryOptions({
      connection,
      address: auth.authenticated ? (auth.activeWallet?.address ?? "") : "",
    }),
  );

  return (
    <Select {...props}>
      <SelectTrigger className="h-auto!">
        <SelectValue placeholder={"Select token"}>
          {(balance: NonNullable<typeof balances.data>[number]) => {
            return (
              <div className="flex items-center justify-center gap-2 px-2">
                <Avatar variant={"square"}>
                  <AvatarImage src={balance?.metadata.image} />
                </Avatar>
                <span className="flex flex-col font-bold text-sm">
                  {balance?.metadata?.symbol || "Unknown"}
                  <span className="text-[10px] opacity-75">
                    {balance?.metadata?.name || "Unknown Token"}
                  </span>
                </span>
              </div>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {balances.isPending ? (
            <div className="grid h-20 place-content-center">
              <Spinner className="size-4" />
            </div>
          ) : balances.isError ? (
            <div className="grid h-20 place-content-center text-center text-destructive">
              Error fetching Tokens
              <Button
                variant="outline"
                size="sm"
                onClick={() => balances.refetch()}
                loading={balances.isRefetching}
              >
                Retry
              </Button>
            </div>
          ) : (
            balances.data.map((balance) => (
              <SelectItem
                key={balance.info.mint}
                value={balance}
                className="flex flex-row items-center justify-center gap-2 rounded-xl px-2"
              >
                <Avatar variant={"square"}>
                  <AvatarImage src={balance?.metadata.image} />
                </Avatar>
                <span className="flex flex-col font-bold text-sm">
                  {balance?.metadata?.symbol || "Unknown"}
                  <span className="text-[10px] opacity-75">
                    {balance?.metadata?.name || "Unknown Token"}
                  </span>
                </span>
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
