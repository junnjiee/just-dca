import { useTransition } from "react";
import { Loader2 } from "lucide-react";

import {
  useUserInput,
  useUserInputDispatch,
} from "@/contexts/user-input/context";

import { createDate } from "@/lib/utils";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DateRangeTabsProps = {
  className?: string;
};

export function DateRangeTabs({ className }: DateRangeTabsProps) {
  const userInput = useUserInput();
  const userInputDispatch = useUserInputDispatch();
  const [isPending, startTransition] = useTransition();

  // NOTE: can memoize this
  const datePresets = [
    { dateRange: "3M", start: createDate(2), end: createDate(0) },
    { dateRange: "6M", start: createDate(5), end: createDate(0) },
    { dateRange: "1Y", start: createDate(11), end: createDate(0) },
    { dateRange: "3Y", start: createDate(35), end: createDate(0) },
    { dateRange: "5Y", start: createDate(59), end: createDate(0) },
    { dateRange: "10Y", start: createDate(119), end: createDate(0) },
  ];

  // use useTransition instead to show pending state
  const handleDateChange = (start: string, end: string) => {
    startTransition(() =>
      userInputDispatch({
        type: "updateDates",
        dates: { start: start, end: end },
      }),
    );
  };

  // if date chosen matches preset, select that tab
  const chosenPreset = () => {
    const preset = datePresets.find(
      (preset) =>
        userInput.start == preset.start && userInput.end == preset.end,
    )?.dateRange;

    return preset ? preset : "";
  };

  return (
    <>
      <Tabs value={chosenPreset()} className={className}>
        <TabsList className="w-full md:w-1/2">
          {datePresets.map((preset) => (
            <TabsTrigger
              className="w-full"
              key={preset.dateRange}
              value={preset.dateRange}
              onClick={() => handleDateChange(preset.start, preset.end)}
            >
              {preset.dateRange}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {isPending ? <Loader2 className="animate-spin" /> : <></>}
    </>
  );
}
