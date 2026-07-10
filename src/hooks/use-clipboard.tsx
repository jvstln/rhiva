import { useCopyToClipboard as useCopyToClipboardPrimitive } from "@uidotdev/usehooks";
import * as React from "react";
import { getErrorMessage } from "@/lib/utils";

type CopyState = "idle" | "copied" | "error";

export const useCopyToClipboard = () => {
  const [copiedText, _copy] = useCopyToClipboardPrimitive();
  const [error, setError] = React.useState("");
  const [copyState, setCopyState] = React.useState<CopyState>("idle");

  const copy = async (text: string) => {
    try {
      await _copy(text);
      setCopyState("copied");
    } catch (error) {
      setError(getErrorMessage(error, "Failed to copy text"));
      setCopyState("error");
    } finally {
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  return { copy, copyState, copiedText, error };
};
