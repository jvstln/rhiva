"use client";

import type * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type PoolFiltersDialogProps = Dialog.Props & {
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
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input placeholder={placeholder} />
    </Field>
  );
}

export function PoolFiltersDialog({
  children,
  ...props
}: PoolFiltersDialogProps) {
  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="flex h-full flex-col">
        <DialogHeader>
          <DialogTitle>Pool Filters</DialogTitle>
        </DialogHeader>

        <ScrollArea
          className={"-mx-(--padding-x) min-h-0 grow px-(--padding-x)"}
        >
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel>Select saved filter</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filter1">Example Filter 1</SelectItem>
                  <SelectItem value="filter2">Example Filter 2</SelectItem>
                </SelectContent>
              </Select>
            </Field>
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
              <Field orientation={"horizontal"}>
                <Switch id="best-fee" />
                <FieldLabel
                  htmlFor="best-fee"
                  className="text-muted-foreground text-sm"
                >
                  Best Fee/TVL pool Per Token
                </FieldLabel>
              </Field>
              <div className="text-muted-foreground text-sm">Name filter</div>
            </div>
          </div>
          <ScrollBar orientation="vertical" showScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
