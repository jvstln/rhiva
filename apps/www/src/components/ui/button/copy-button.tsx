"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./index";

export function CopyButton({
  copy,
  ...props
}: Button.Props & { copy?: string | number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    if (!copy) return;

    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(copy.toString());
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      {...props}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="size-3 text-up transition-colors" />
      ) : (
        <Copy className="size-3 text-gray transition-colors hover:text-white" />
      )}
    </Button>
  );
}
