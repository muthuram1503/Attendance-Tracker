"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { addMonths } from "date-fns";
import moment from "moment";
import { Calendar } from "@/components/ui/calendar";

function MonthSelection({ onChange = () => {} }) {
  const today = new Date();
  const nextMonths = addMonths(today, 0);
  const [Month, SetMonth] = useState(nextMonths);

  const handleMonthChange = (value) => {
    onChange(value);   // Corrected to use onChange
    SetMonth(value);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button
            variant="outline"
            className="flex gap-2 items-center text-slate-500"
          >
            <CalendarDays className="h-5 w-5" />
            {moment(Month).format("MMM YYYY")}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            month={Month}
            onMonthChange={handleMonthChange}
            className="flex flex-1 justify-center"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MonthSelection;
