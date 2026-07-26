import { useCopyToClipboard as useCopyToClipboardPrimitive } from "@uidotdev/usehooks";
import * as React from "react";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

type CopyState = "idle" | "copied" | "error";

export const useCopyToClipboard = () => {
  const [copiedText, _copy] = useCopyToClipboardPrimitive();
  const [error, setError] = React.useState("");
  const [copyState, setCopyState] = React.useState<CopyState>("idle");

  const copy = async (
    text?: string | number,
    options: { toast?: string; errorToast?: string } = {},
  ) => {
    try {
      if (!text) throw new Error("No text to copy");

      await _copy(String(text));
      if (options.toast || options.toast === undefined) {
        toast.success(options.toast ?? "Text copied");
      }
      setCopyState("copied");
    } catch (error) {
      setError(getErrorMessage(error, "Failed to copy text"));
      if (options.errorToast || options.errorToast === undefined) {
        toast.warning(options.errorToast ?? "Failed to copy item", {
          description: getErrorMessage(error),
        });
      }
      setCopyState("error");
    } finally {
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  return { copy, copyState, copiedText, error };
};
