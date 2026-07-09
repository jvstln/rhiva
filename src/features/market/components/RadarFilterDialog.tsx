import {
  CircleDashed,
  Droplets,
  Pill,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalize } from "@/lib/utils";
import { RadarColumns } from "../market.schema";

const PROTOCOLS = [
  {
    id: "pump",
    name: "Pump",
    icon: Pill,
    className: "[--accent:var(--color-emerald-500)]",
  },
  {
    id: "mayhem",
    name: "Mayhem",
    icon: Zap,
    className: "[--accent:var(--color-red-500)]",
  },
  {
    id: "bags",
    name: "Bags",
    icon: Shield,
    className: "[--accent:var(--color-green-500)]",
  },
  {
    id: "bonk",
    name: "Bonk",
    icon: CircleDashed,
    className: "[--accent:var(--color-orange-500)]",
  },
  {
    id: "surge",
    name: "Surge",
    icon: Zap,
    className: "[--accent:var(--color-green-400)]",
  },
  {
    id: "moonshot",
    name: "Moonshot",
    icon: Rocket,
    className: "[--accent:var(--color-purple-500)]",
  },
  {
    id: "liquidaf",
    name: "LiquidAF",
    icon: Droplets,
    className: "[--accent:var(--color-blue-500)]",
  },
];

export function RadarFilterDialog({
  children,
}: Dialog.Props & { children: React.ReactElement }) {
  const [activeTab, setActiveTab] = React.useState<string>(
    RadarColumns.options[0],
  );

  return (
    <Dialog>
      {children && <DialogTrigger render={children} />}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <DialogContent>
          <DialogHeader className="pb-0">
            <DialogTitle>Filters</DialogTitle>

            <div className="-mx-(--padding-x)">
              <TabsList variant="line" className="w-full">
                {RadarColumns.options.map((col) => (
                  <TabsTrigger key={col} value={col}>
                    {capitalize(col)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Search Keywords</FieldLabel>
                <Input data-size="sm" placeholder="Keyword1, Keyword2..." />
              </Field>
              <Field>
                <FieldLabel>Exclude Keywords</FieldLabel>
                <Input data-size="sm" placeholder="Keyword1, Keyword2..." />
              </Field>
              <Field>
                <FieldLabel>Search x @Handle</FieldLabel>
                <Input data-size="sm" placeholder="Handle1, Handle2..." />
              </Field>
              <Field>
                <FieldLabel>Search Dev Wallet</FieldLabel>
                <Input data-size="sm" placeholder="Wallet1, Wallet2..." />
              </Field>
            </div>

            <Tabs defaultValue="protocols" className="w-full">
              <TabsList variant="default" className="w-full">
                <TabsTrigger value="protocols">Protocols</TabsTrigger>
                <TabsTrigger value="audit">Audit</TabsTrigger>
                <TabsTrigger value="metrics">$Metrics</TabsTrigger>
                <TabsTrigger value="socials">Socials</TabsTrigger>
              </TabsList>

              <TabsContent value="protocols" className="space-y-6 pt-2">
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground text-sm">
                    Launchpads
                  </h3>
                  <ToggleGroup
                    multiple
                    className="flex-wrap"
                    variant={"outline"}
                    size="sm"
                  >
                    {PROTOCOLS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <ToggleGroupItem
                          key={p.id}
                          value={p.id}
                          className={p.className}
                        >
                          <Icon />
                          {p.name}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground text-sm">
                    Quote Tokens
                  </h3>
                  <ToggleGroup
                    multiple
                    className="flex-wrap"
                    variant={"outline"}
                    size="sm"
                  >
                    {PROTOCOLS.slice(0, 3).map((p) => {
                      const Icon = p.icon;
                      return (
                        <ToggleGroupItem
                          key={p.id}
                          value={p.id}
                          className={p.className}
                        >
                          <Icon />
                          {p.name}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>
              </TabsContent>

              <TabsContent value="audit" className="space-y-6 pt-2">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox id="dex-paid" />
                    <label
                      htmlFor="dex-paid"
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Dex Paid
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="ca-pump" />
                    <label
                      htmlFor="ca-pump"
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      CA ends in 'pump'
                    </label>
                  </div>
                </div>

                <Field>
                  <FieldLabel>Recent Visitors</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Age</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Top 10 Holders %</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Dev Holdings %</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-6 pt-2">
                <Field>
                  <FieldLabel>Liquidity ($)</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Volume ($)</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Market Cap ($)</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>
                <Field>
                  <FieldLabel>B. curve %</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Global Fees Paid (SOL)</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>
              </TabsContent>

              <TabsContent value="socials" className="space-y-6 pt-2">
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-input/30 font-normal"
                  >
                    Community
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-input/30 font-normal"
                  >
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-input/30 font-normal"
                  >
                    Website
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-input/30 font-normal"
                  >
                    Telegram
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-input/30 font-normal"
                  >
                    At Least One Social
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-input/30 font-normal"
                  >
                    Only Pump Live
                  </Button>
                </div>

                <Field>
                  <FieldLabel>Volume ($)</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>
                    Include Twitter Handles ( up to 10, comma separated)
                  </FieldLabel>
                  <Input placeholder="e.g rhivadotfun, mist_trading, ..." />
                </Field>

                <Field>
                  <FieldLabel>Rhiva Community Members</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Twitter Followers</FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup>
                      <InputGroupInput placeholder="Min" type="number" />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupInput placeholder="Max" type="number" />
                    </InputGroup>
                  </div>
                </Field>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <DialogClose render={<Button className={"w-full"} />}>
              Apply All
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Tabs>
    </Dialog>
  );
}
