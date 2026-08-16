"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/ui/search-input";
import { QueryState } from "@/components/layout/QueryState";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchTokens } from "../market.hook";
import { SearchTokenCard } from "./search-token-card";

export function SearchTokenDialog({
  children,
  ...props
}: Dialog.Props & { children?: React.ReactElement }) {
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  const query = useSearchTokens(debouncedSearch);

  return (
    <Dialog
      {...props}
      onOpenChange={(...args) => {
        props.onOpenChange?.(...args);

        // Clear search on close
        if (args[0] === false) {
          setSearchValue("");
          setDebouncedSearch("");
        }
      }}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent className="flex h-[550px] flex-col">
        <DialogHeader>
          <DialogTitle>Search Tokens</DialogTitle>
        </DialogHeader>

        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 pt-2">
          <SearchInput
            placeholder="Search by address, name, or symbol..."
            value={searchValue}
            onValueChange={setSearchValue}
            onDebouncedValueChange={setDebouncedSearch}
            className="w-full max-w-none"
            autoFocus
          />

          <ScrollArea className="-mx-4 h-full min-h-0 flex-1 px-4">
            {debouncedSearch ? (
              <QueryState
                query={query}
                getIsEmpty={(q) => {
                  return (
                    q.data.length === 0 && {
                      title: "No tokens found",
                      description:
                        "Try searching for a different address, name, or symbol",
                    }
                  );
                }}
              >
                {(queryResult) => (
                  <div className="flex flex-col">
                    {queryResult.data.map((token) => (
                      <SearchTokenCard
                        key={token.mint}
                        token={token}
                      />
                    ))}
                  </div>
                )}
              </QueryState>
            ) : (
              <QueryState
                query={{ data: [] }}
                getIsEmpty={() => ({
                  title: "Search tokens",
                  description:
                    "Enter a token name, symbol, or contract address to begin",
                })}
              />
            )}
            <ScrollBar
              orientation="vertical"
              showIndicator
              showScrollBar
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
