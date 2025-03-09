"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { ScrollArea } from "../components/ui/scroll-area";
import { useState } from "react";


interface MonthlyPickerProps {
  startYear: number;
  endYear: number;
  selected: Date; // Ensure selected is always a Date object
  onSelect: (date: Date) => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthlyPicker: React.FC<MonthlyPickerProps> = ({
  startYear,
  endYear,
  selected,
  onSelect,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[selected?.getMonth()] || ""
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    selected?.getFullYear().toString() || ""
  );
  const [isTouched, setIsTouched] = useState<{ month: boolean; year: boolean }>({
    month: false,
    year: false,
  });

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setIsTouched((prev) => ({ ...prev, month: true }));
    const year = selectedYear ? parseInt(selectedYear) : startYear;
    onSelect(new Date(year, months.indexOf(month)));
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setIsTouched((prev) => ({ ...prev, year: true }));
    const monthIndex = selectedMonth ? months.indexOf(selectedMonth) : 0;
    onSelect(new Date(parseInt(year), monthIndex));
  };

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div className="grid grid-cols-2 gap-4 max-w-[360px] dark:text-white">
      {/* Month Selector */}
      <Select onValueChange={handleMonthChange}>
        <SelectTrigger
          className={`${
            isTouched.year && !selectedMonth ? "border-red-500" : ""
          } h-auto shadow-sm focus:outline-0 focus:ring-0 focus:ring-offset-0`}
        >
          <SelectValue
            placeholder={
              <div className="flex flex-col items-start">
                <span className="font-normal dark:text-white">
                  {selectedMonth || "-"}
                </span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-48">
            {months.map((month, index) => (
              <SelectItem key={index} value={month}>
                {month}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>

      {/* Year Selector */}
      <Select onValueChange={handleYearChange}>
        <SelectTrigger
          className={`${
            isTouched.month && !selectedYear ? "border-red-500" : ""
          } h-auto shadow-sm focus:outline-0 focus:ring-0 focus:ring-offset-0`}
        >
          <SelectValue
            placeholder={
              <div className="flex flex-col items-start">
                <span className="font-normal dark:text-white">
                  {selectedYear || "-"}
                </span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-48">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthlyPicker;
