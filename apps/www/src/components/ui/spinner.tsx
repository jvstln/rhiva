import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/public/logo-icon";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LogoIcon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

function RhivaSpinner({ className, ...props }: React.ComponentProps<"svg">) {
  return <LogoIcon className={cn("size-4 animate-spin", className)} />;
}

export { Spinner, RhivaSpinner };
