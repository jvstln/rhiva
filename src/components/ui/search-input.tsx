import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Input } from "./input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

export namespace SearchInput {
  export type Props = React.ComponentProps<typeof Input> & {
    ref?: React.Ref<HTMLInputElement>;
  };
}

export function SearchInput({ className, ref, ...props }: SearchInput.Props) {
  return (
    <InputGroup className={cn("max-w-[297px] w-full rounded-full", className)}>
      <InputGroupInput
        ref={ref}
        type="search"
        placeholder={"Search"}
        {...props}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
