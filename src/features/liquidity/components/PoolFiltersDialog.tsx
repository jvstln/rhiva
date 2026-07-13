"use client";

import type * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type PoolFiltersDialogProps = React.ComponentProps<typeof Dialog> & {
  children?: React.ReactElement;
};

function FilterInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <Input placeholder={placeholder} className="rounded-md" />
    </div>
  );
}

export function PoolFiltersDialog({
  children,
  ...props
}: PoolFiltersDialogProps) {
  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="max-w-[600px] gap-6 p-6">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">
            Pool Filters
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm">
              Select saved filter
            </span>
            <Select>
              <SelectTrigger className="w-full justify-between rounded-md">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="filter1">Example Filter 1</SelectItem>
                <SelectItem value="filter2">Example Filter 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FilterInput label="Min Market Cap" placeholder="Min" />
            <FilterInput label="Max Market Cap" placeholder="Max" />

            <FilterInput label="Min Volume" placeholder="Min" />
            <FilterInput label="Max Volume" placeholder="Max" />

            <FilterInput label="Min Age" placeholder="Min" />
            <FilterInput label="Max Age" placeholder="Max" />

            <FilterInput label="Min Liquidity" placeholder="Min" />
            <FilterInput label="Max Liquidity" placeholder="Max" />

            <FilterInput label="Min Bin Step" placeholder="Min" />
            <FilterInput label="Max Bin Step" placeholder="Max" />

            <FilterInput label="Min Base Fee(%)" placeholder="Min" />
            <FilterInput label="Max Base Fee(%)" placeholder="Max" />

            <FilterInput label="Min 24h fees" placeholder="Min" />
            <FilterInput label="Max24h fees" placeholder="Max" />
          </div>

          <div className="mt-2 grid grid-cols-2 items-center gap-x-6">
            <div className="flex items-center gap-3">
              <Switch id="best-fee" />
              <label
                htmlFor="best-fee"
                className="text-muted-foreground text-sm"
              >
                Best Fee/TVL pool Per Token
              </label>
            </div>
            <div className="text-muted-foreground text-sm">Name filter</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
