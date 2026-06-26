"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ICON_OPTIONS, getIcon } from "@/lib/icons";

interface IconPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function IconPicker({ value, onValueChange, placeholder = "Pilih icon…" }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const SelectedIcon = getIcon(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-full justify-between px-3 font-normal"
        >
          <span className="flex items-center gap-2 truncate">
            {SelectedIcon ? (
              <SelectedIcon className="h-4 w-4 shrink-0" />
            ) : (
              <span className="h-4 w-4 shrink-0 rounded border border-dashed border-muted-foreground/30" />
            )}
            <span className="truncate text-xs">{value || placeholder}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Cari icon…" />
          <CommandList>
            <CommandEmpty>Icon tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {ICON_OPTIONS.map((name) => {
                const Icon = getIcon(name);
                return (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={() => {
                      onValueChange(name);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        value === name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    <span className="text-xs">{name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
