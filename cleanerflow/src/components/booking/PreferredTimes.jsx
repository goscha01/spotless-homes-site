import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, addDays, isWeekend, startOfDay, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";

// Generate specific time slots with 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 17 && minute === 30) break; // Stop at 5:30 PM
      const time12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const timeStr = `${time12}:${minute.toString().padStart(2, '0')} ${ampm}`;
      slots.push(timeStr);
    }
  }
  return slots;
};

const specificTimeSlots = generateTimeSlots();

// Calendar Component
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onDayClick,
  disabled,
  ...props
}) {
  const today = startOfDay(new Date()); // Local timezone
  const fromMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  console.log("Calendar component - selected dates:", selected);
  
  return (
    <DayPicker
      mode="multiple"
      showOutsideDays={showOutsideDays}
      className={className}
      fromMonth={fromMonth}
      disabled={disabled}
      selected={selected}
      onDayClick={onDayClick}
      classNames={{
        months: "flex flex-col",
        month: "space-y-6",
        caption: "flex items-center justify-between px-4",
        caption_label: "text-lg font-semibold relative -top-6",
        nav: "flex justify-between items-center space-x-4",
        nav_button:
          "h-10 w-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        head_row: "grid grid-cols-7 text-center",
        head_cell: "text-gray-500 text-xs md:text-sm font-semibold p-1 md:p-2",
        row: "grid grid-cols-7 text-center gap-3",
        cell: "flex items-center justify-center cursor-pointer transition-all duration-200",
        day: "text-center px-2 py-2 md:px-2.5 md:py-2.5 font-medium rounded-md text-base md:text-lg",
        day_selected: "!text-white !font-bold !shadow-md !bg-primary !border-2 !border-primary !important",
        day_today:
          "border-2 border-blue-500 text-blue-600 font-semibold shadow-sm",
        day_outside: "text-gray-400 opacity-50",
        day_disabled:
          "text-gray-300 cursor-not-allowed opacity-50 pointer-events-none",
        day_range_middle: "bg-blue-100 text-blue-700",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export default function PreferredTimes({ form, nextStep }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [error, setError] = useState("");
  const [activeDate, setActiveDate] = useState(null);
  const [timePreference, setTimePreference] = useState("beforenoon"); // "specific", "beforenoon", or "afternoom"
  const [specificHour, setSpecificHour] = useState("9");
  const [specificMinute, setSpecificMinute] = useState("00");

  console.log("Current selectedDates:", selectedDates);

  // Normalize dates to start of day in local timezone
  const normalizeDate = (date) => startOfDay(date);

  // Sync local state with form
  useEffect(() => {
    const formattedDates = selectedDates.map((date) =>
      format(normalizeDate(date), "yyyy-MM-dd")
    );
    form.setValue("preferredDates", formattedDates);
    form.setValue("preferredTimes", selectedTimes);
  }, [selectedDates, selectedTimes, form]);

  // Initialize form values with preselected date (working days only)
  useEffect(() => {
    const timer = setTimeout(() => {
      const today = new Date();
      let targetDate = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000)); // Start with 2 days from now
      
      // If the target date is a weekend, move to the next Monday
      while (isWeekend(targetDate)) {
        targetDate = addDays(targetDate, 1);
      }
      
      const normalizedDate = normalizeDate(targetDate);
      const dateKey = format(normalizedDate, "yyyy-MM-dd");
      
      console.log("Preselecting date:", normalizedDate, "key:", dateKey, "day:", format(normalizedDate, "EEEE"));
      console.log("Setting selectedDates to:", [normalizedDate]);
      
      setSelectedDates([normalizedDate]);
      setSelectedTimes({});
      form.setValue("preferredDates", [dateKey]);
      form.setValue("preferredTimes", {});
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Validation logic
  useEffect(() => {
    if (selectedDates.length === 0) {
      setError("Please select one or more dates and time.");
    } else {
      setError("");
    }
  }, [selectedDates, selectedTimes]);

  // Disable only past dates in local timezone
  const disabledDays = (date) => {
    const normalizedDate = normalizeDate(date);
    const today = normalizeDate(new Date());
    return normalizedDate < today;
  };

  // Handle date selection/deselection
  const handleDateToggle = (date) => {
    const normalizedDate = normalizeDate(date);
    const dateKey = format(normalizedDate, "yyyy-MM-dd");
    const isSelected = selectedDates.some((d) => isSameDay(d, normalizedDate));

    if (isSelected) {
      // If date is already selected, open time popup
      setActiveDate(dateKey);
    } else {
      // Select new date and open time popup
      const newDates = [...selectedDates, normalizedDate];
      newDates.sort((a, b) => a - b);
      setSelectedDates(newDates);
      setActiveDate(dateKey);
    }
  };

  // Handle adding specific time
  const handleAddSpecificTime = () => {
    if (activeDate && specificHour && specificMinute) {
      const hour24 = parseInt(specificHour);
      const displayHour = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      const timeString = `${displayHour}:${specificMinute} ${ampm}`;
      
      setSelectedTimes((prev) => {
        const newTimes = { ...prev };
        if (newTimes[activeDate]) {
          if (!newTimes[activeDate].includes(timeString)) {
            newTimes[activeDate] = [...newTimes[activeDate], timeString];
          }
        } else {
          newTimes[activeDate] = [timeString];
        }
        return newTimes;
      });
    }
  };

  // Handle before noon selection
  const handleBeforeNoonSelection = () => {
    if (activeDate) {
      setSelectedTimes((prev) => ({
        ...prev,
        [activeDate]: ["Before noon"]
      }));
    }
  };

  // Handle after noon selection
  const handleAfterNoonSelection = () => {
    if (activeDate) {
      setSelectedTimes((prev) => ({
        ...prev,
        [activeDate]: ["After noon"]
      }));
    }
  };

  // Set Before noon as default when opening popup
  useEffect(() => {
    if (activeDate && !selectedTimes[activeDate]) {
      handleBeforeNoonSelection();
    }
  }, [activeDate]);


  // Remove specific time
  const handleRemoveTime = (dateKey, time) => {
    setSelectedTimes((prev) => {
      const newTimes = { ...prev };
      if (newTimes[dateKey]) {
        newTimes[dateKey] = newTimes[dateKey].filter((t) => t !== time);
        if (newTimes[dateKey].length === 0) {
          delete newTimes[dateKey];
        }
      }
      return newTimes;
    });
  };

  return (
    <div className="h-full lg:h-[580px] flex flex-col">
      <div className="bg-white rounded-lg border p-4 md:p-6 h-full flex flex-col justify-between">
        <div className="space-y-6 lg:space-y-4">
          <div className="text-center">
            <Calendar
              key={selectedDates.length}
              selected={selectedDates}
              onDayClick={handleDateToggle}
              disabled={disabledDays}
              className="max-w-md mx-auto"
            />
          </div>

            {selectedDates.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                <p className="text-sm md:text-[16px] text-gray-600 mb-4 md:mb-6 text-center">
                  Please select one or more dates and time.
                </p>
              </div>
            )}

          {error && <p className="text-sm text-center text-primary">{error}</p>}
        </div>

        <div className="mt-6 lg:mt-6 flex justify-between items-center">
          <Button
            type="button"
            onClick={() => {
              // Check if time is already selected
              if (selectedDates.length > 0) {
                const dateKey = format(selectedDates[0], "yyyy-MM-dd");
                
                // If time is already selected, go to next step
                if (selectedTimes[dateKey] && selectedTimes[dateKey].length > 0) {
                  nextStep();
                } else {
                  // If no time selected, open time popup
                  setActiveDate(dateKey);
                }
              }
            }}
            className="continue-button px-6 py-4 text-sm text-white bg-primary hover:bg-primaryHover whitespace-nowrap"
          >
            Book Appointment
          </Button>
          <Button
            type="button"
            onClick={() => {
              // Handle quote request - skip to final step without date validation and mark as estimate only
              form.setValue("isEstimateOnly", true);
              nextStep();
            }}
            className="px-6 py-4 text-sm bg-transparent text-primary border border-primary opacity-50 hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            Send Estimate only
          </Button>
        </div>
      </div>

      {/* Time Selection Popup */}
      {activeDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Select times for{" "}
                {format(
                  selectedDates.find(
                    (date) => format(date, "yyyy-MM-dd") === activeDate
                  ) || new Date(),
                  "EEE, MMM do",
                  { locale: enUS }
                )}
              </h3>
              <button
                onClick={() => setActiveDate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Time Selection Toggle Buttons */}
            <div className="mb-4 space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setTimePreference("beforenoon");
                    handleBeforeNoonSelection();
                    setActiveDate(null); // Close the window immediately
                  }}
                  className={`flex-1 py-2 rounded-md transition-all ${
                    timePreference === "beforenoon"
                      ? "bg-primary/20 text-black border-2 border-primary"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-primary/10 hover:text-black"
                  }`}
                >
                  Before noon
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setTimePreference("afternoom");
                    handleAfterNoonSelection();
                    setActiveDate(null); // Close the window immediately
                  }}
                  className={`flex-1 py-2 rounded-md transition-all ${
                    timePreference === "afternoom"
                      ? "bg-primary/20 text-black border-2 border-primary"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-primary/10 hover:text-black"
                  }`}
                >
                  After noon
                </Button>
                <Button
                  type="button"
                  onClick={() => setTimePreference("specific")}
                  className={`flex-1 py-2 rounded-md transition-all ${
                    timePreference === "specific"
                      ? "bg-primary/20 text-black border-2 border-primary"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-primary/10 hover:text-black"
                  }`}
                >
                  Specific time
                </Button>
              </div>

              {/* Show time inputs only when "specific" is selected */}
              {timePreference === "specific" && (
                <div className="flex gap-2">
                  <div className="flex items-center gap-1" style={{ width: '66.666%' }}>
                    <select
                      value={specificHour}
                      onChange={(e) => setSpecificHour(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {Array.from({ length: 11 }, (_, i) => i + 8).map(hour => (
                        <option key={hour} value={hour}>
                          {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-500">:</span>
                    <select
                      value={specificMinute}
                      onChange={(e) => setSpecificMinute(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                  </div>
                  <div className="flex gap-2" style={{ width: '33.333%' }}>
                    <Button
                      type="button"
                      onClick={handleAddSpecificTime}
                      className="w-10 h-10 bg-white text-primary border-2 border-primary text-lg rounded-md hover:bg-primary/10 flex items-center justify-center transition-colors"
                    >
                      +
                    </Button>
                    <button
                      onClick={() => setActiveDate(null)}
                      className="flex-1 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
                    >
                      ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
