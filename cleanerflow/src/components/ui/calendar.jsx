import * as React from "react";
import { DayPicker } from "react-day-picker";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  // Get today's date
  const today = new Date();
  // Set the first selectable month as the current month
  const fromMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      fromMonth={fromMonth}
      disabled={(date) => date < today.setHours(0, 0, 0, 0)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-6",
        caption: "flex items-center justify-between px-4",
        caption_label: "text-lg font-semibold relative -top-6",
        nav: "flex justify-between items-center space-x-4",
        nav_button:
          "h-10 w-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        head_row: "grid grid-cols-7 text-center",
        head_cell: "text-gray-500 text-sm font-semibold p-2",
        row: "grid grid-cols-7 text-center gap-1",
        cell: "flex items-center justify-center cursor-pointer transition-all duration-200",
        day: "text-center md:p-6 font-medium rounded-full",
        day_selected: "text-white font-bold shadow-md",
        day_today:
          "border-2 border-blue-500 text-blue-600 font-semibold shadow-sm",
        day_outside: "text-gray-400 opacity-50 ",
        day_disabled:
          "text-gray-300 cursor-not-allowed opacity-5 pointer-events-none",
        day_range_middle: "bg-blue-100 text-blue-700",
        day_hidden: "invisible",
        // table: "w-[100%] md:w-[95%] lg:w-[90%] xl:w-[85%] max-w-full",
        ...classNames,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
