import { Bot } from "lucide-react";

export function AssistantBubble() {
  return (
    <button
      type="button"
      className="fixed bottom-8 right-8 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_theme(colors.primary/0.55)] transition-transform hover:scale-105"
      aria-label="Open assistant"
    >
      <Bot className="size-7" />
    </button>
  );
}
