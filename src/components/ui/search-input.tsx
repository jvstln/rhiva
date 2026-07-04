import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Input } from "./input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

export interface SearchInputProps extends React.ComponentProps<typeof Input> {
  ref?: React.Ref<HTMLInputElement>;
}

export function SearchInput({ className, ref, ...props }: SearchInputProps) {
  return (
    <InputGroup className="w-[297px]">
      <InputGroupInput
        ref={ref}
        type="search"
        className={cn(className)}
        {...props}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
