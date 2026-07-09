import { Info } from "lucide-react";
import { QueryState } from "@/components/layout/QueryState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { arrayWithId } from "@/lib/utils";

const TABS = ["All", "Dev", "CA", "Keyword", "Website", "Twitter Hand"];

export function BlacklistDialog({
  children,
}: Dialog.Props & { children: React.ReactElement }) {
  return (
    <Dialog>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Blacklist</DialogTitle>
        </DialogHeader>

        <div className="flex w-full min-w-0 flex-col gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Input
              data-size="sm"
              placeholder="Enter twitter profile, dev address or keyword"
            />
            <Button size="sm">Blacklist</Button>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Info className="h-4 w-4 shrink-0" />
            <p>Add multiple blacklist types</p>
          </div>

          <Tabs defaultValue={TABS[0]} className="-mx-(--padding-x)">
            <ScrollArea className={""} showIndicator>
              <TabsList variant="line" className="border-b">
                {arrayWithId(TABS).map(({ id, value: tab }) => (
                  <TabsTrigger key={id} value={tab}>
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Tabs>
        </div>

        <ScrollArea className="-mx-4 h-[300px] px-4">
          <QueryState
            query={{ data: [] }}
            getIsEmpty={() => ({
              title: "No blacklist items",
              description: "Items you blacklist will apear here",
            })}
          />
        </ScrollArea>

        <div className="-mx-4 -mb-4 flex items-center justify-between border-border/70 border-t px-4 py-4">
          <span className="font-medium text-muted-foreground text-xs">
            0 / 5000 blacklists
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline">Import/Export</Button>
            <Button variant="default">Delete all</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
