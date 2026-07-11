import { Copy } from "lucide-react";
import { Button } from "./index";

export default function CopyButton() {
  return (
    <Button variant="ghost" size="icon-xs">
      <Copy className="size-3 text-gray transition-colors hover:text-white" />
    </Button>
  );
}
