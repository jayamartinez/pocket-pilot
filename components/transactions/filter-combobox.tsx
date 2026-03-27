"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterComboboxProps {
  allLabel: string;
  className?: string;
  emptyLabel: string;
  options: string[];
  searchPlaceholder: string;
  value: string;
  onValueChange: (value: string) => void;
}

interface ComboboxOption {
  actualValue: string;
  label: string;
  value: string;
}

function createOption(value: string, label: string): ComboboxOption {
  return {
    actualValue: value,
    label,
    value: label.toLowerCase(),
  };
}

export function FilterCombobox({
  allLabel,
  className,
  emptyLabel,
  onValueChange,
  options,
  searchPlaceholder,
  value,
}: FilterComboboxProps) {
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => [createOption("all", allLabel), ...options.map((option) => createOption(option, option))],
    [allLabel, options],
  );

  const selectedItem = items.find((item) => item.actualValue === value) ?? items[0];

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "h-10 w-full justify-between rounded-xl border-input bg-muted/70 px-3 text-sm font-medium shadow-none hover:bg-muted/85",
            className,
          )}
          role="combobox"
          variant="outline"
        >
          <span className="truncate">{selectedItem.label}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground/80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-[220px] rounded-2xl border-border/80 p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No {emptyLabel} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  className="gap-2 rounded-xl px-3 py-2.5"
                  key={item.actualValue}
                  keywords={[item.label.toLowerCase()]}
                  onSelect={() => {
                    onValueChange(item.actualValue);
                    setOpen(false);
                  }}
                  value={item.value}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === item.actualValue ? "text-primary opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
