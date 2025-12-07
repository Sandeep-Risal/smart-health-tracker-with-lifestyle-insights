"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/src/shared/components/ui/button";
import { Calendar } from "@/src/shared/components/ui/calendar";
import { Label } from "@/src/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/components/ui/popover";
import moment from "moment";

interface DatePickerProps {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(
    value || new Date()
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setOpen(false);
    onChange?.(selectedDate);
  };

  return (
    <div className={`flex flex-col gap-3 ${className || ""}`}>
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
            disabled={disabled}
          >
            {value ? moment(value).format("MMM DD, YYYY") : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
