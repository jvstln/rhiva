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
import { QuickSell, RadarColumns } from "../market.schema";

export function RadarQuickSellDialog({
  children,
}: Dialog.Props & { children: React.ReactElement }) {
  const quickSellSettings = useMarketStore(
    (state) => state.radarSettings.quickSell,
  );
  const setQuickSellSettings = useMarketStore(
    (state) => state.radarSettings.setQuickSell,
  );

  const activeColumns = Object.keys(quickSellSettings).filter(
    (column) =>
      quickSellSettings[column as keyof typeof quickSellSettings].value !==
      null,
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
              setQuickSellSettings(
                Object.fromEntries(
                  RadarColumns.options.map((col) => [
                    col,
                    { value: value === "off" ? null : 0 },
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
                        setQuickSellSettings({
                          [column]: { value: pressed ? 0 : null },
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
            {Object.entries(quickSellSettings).map(([column, settings]) => {
              if (settings.value === null) return null;

              return (
                <Field key={column}>
                  <FieldContent className="flex-row justify-between">
                    <FieldLabel>{capitalize(column)}</FieldLabel>
                    <ToggleGroup
                      spacing={0}
                      size={"sm"}
                      value={[settings.unit]}
                      onValueChange={(value) => {
                        setQuickSellSettings({ [column]: { unit: value[0] } });
                      }}
                    >
                      <ToggleGroupItem
                        value={QuickSell.shape.unit.enum.percent}
                      >
                        <PercentIcon /> Percent
                      </ToggleGroupItem>
                      <ToggleGroupItem value={QuickSell.shape.unit.enum.init}>
                        <Undo2Icon /> Init
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      value={settings.value}
                      onChange={(e) => {
                        setQuickSellSettings({
                          [column]: { value: e.target.value },
                        });
                      }}
                    />
                    <InputGroupAddon>
                      <InputGroupText>Quick sell</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupAddon align={"inline-end"}>
                      {settings.unit === "percent" ? (
                        <PercentIcon />
                      ) : (
                        <Undo2Icon />
                      )}
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
