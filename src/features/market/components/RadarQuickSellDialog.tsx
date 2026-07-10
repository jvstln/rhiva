import { ArrowDownUp, PercentIcon, Undo2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMarketStore } from "@/features/market/market.store";
import { capitalize } from "@/lib/utils";
import { RadarColumns } from "../market.schema";

export function RadarQuickSellDialog({
  children,
}: Dialog.Props & { children: React.ReactElement }) {
  const radarFilters = useMarketStore((state) => state.radarFilters);
  const setRadarFilters = useMarketStore((state) => state.setRadarFilters);

  const activeColumns = RadarColumns.options.filter(
    (column) => radarFilters[column].quickSell !== null,
  );
  const isOff = activeColumns.length === 0;

  return (
    <Dialog>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Sell Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ToggleGroup
            value={[isOff ? "off" : "on"]}
            onValueChange={([value]) => {
              setRadarFilters(
                Object.fromEntries(
                  RadarColumns.options.map((col) => [
                    col,
                    { quickSell: value === "off" ? null : 0 },
                  ]),
                ),
              );
            }}
          >
            <ToggleGroupItem value="off">
              <XIcon />
              Off
            </ToggleGroupItem>
            <ToggleGroupItem variant={"sell"} value="on">
              <ArrowDownUp />
              Sell
            </ToggleGroupItem>
          </ToggleGroup>

          {!isOff && (
            <div className="space-y-3">
              <h3 className="font-medium text-foreground text-sm">
                Show in Tables
              </h3>
              <ToggleGroup
                className="w-full *:flex-1"
                value={activeColumns}
                multiple
              >
                {RadarColumns.options.map((column) => {
                  return (
                    <ToggleGroupItem
                      key={column}
                      value={column}
                      onPressedChange={(pressed) => {
                        setRadarFilters({
                          [column]: { quickSell: pressed ? 0 : null },
                        });
                      }}
                    >
                      {capitalize(column)}
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>
          )}

          {/* Input Sections */}
          <div className="space-y-4">
            {activeColumns.map((column) => {
              const settings = radarFilters[column];
              const initialSettings =
                useMarketStore.getInitialState().radarFilters[column];

              if (settings.quickSell === null) return null;

              return (
                <Field key={column}>
                  <FieldContent className="flex-row justify-between">
                    <FieldLabel>{capitalize(column)}</FieldLabel>
                    <ToggleGroup
                      spacing={0}
                      size={"sm"}
                      value={[
                        initialSettings.quickSell === settings.quickSell
                          ? "init"
                          : "percent",
                      ]}
                      onValueChange={([value]) => {
                        if (value === "init") {
                          setRadarFilters({
                            [column]: { quickSell: initialSettings.quickSell },
                          });
                        }
                      }}
                    >
                      <ToggleGroupItem value={"percent"}>
                        <PercentIcon /> Percent
                      </ToggleGroupItem>
                      <ToggleGroupItem value={"init"}>
                        <Undo2Icon /> Init
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      min={0}
                      value={settings.quickSell}
                      onChange={(e) => {
                        setRadarFilters({
                          [column]: { quickSell: Number(e.target.value) },
                        });
                      }}
                    />
                    <InputGroupAddon>
                      <InputGroupText>Quick sell</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupAddon align={"inline-end"}>
                      <PercentIcon />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button className={"w-full"} />}>
            Done
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
