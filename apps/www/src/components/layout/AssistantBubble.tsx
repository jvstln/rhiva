"use client";

import { useRef } from "react";
import { Bot, Send } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useGSAP } from "@/lib/gsap.util";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";

export function AssistantBubble() {
  const containerRef = useRef<HTMLButtonElement | null>(null);

  useGSAP(
    () => {
      // Draggable.create(containerRef.current);
    },
    { dependencies: [] },
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            ref={containerRef}
            size="icon-lg"
            className={"fixed right-8 bottom-8 z-50 size-14"}
            style={{ boxShadow: "0 0 24px var(--color-primary)" }}
          />
        }
      >
        <Bot className="size-7" />
      </PopoverTrigger>
      <PopoverContent align="end">
        <PopoverHeader className="flex-row justify-between">
          <div className="flex items-center gap-2">
            <Bot className="size-9 text-primary" />
            <div className="flex flex-col">
              <PopoverTitle>Assistant</PopoverTitle>
              <PopoverDescription>Always here to help</PopoverDescription>
            </div>
          </div>
          <PopoverClose />
        </PopoverHeader>
        <ScrollArea className={"h-100 min-h-0"}>
          <ScrollBar
            showIndicator={false}
            showScrollBar
          />
        </ScrollArea>

        <PopoverFooter>
          <Input />
          <Button size="icon">
            <Send />
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
