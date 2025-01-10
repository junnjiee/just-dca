"use client";

import { createDate } from "@/lib/utils";

import { DcaReturnsQueryInput } from "@/types/financialQueries";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DateRangeTabsProps = {
  userInput: DcaReturnsQueryInput;
  setUserInput: React.Dispatch<React.SetStateAction<DcaReturnsQueryInput>>;
};

export function DateRangeTabs({ userInput, setUserInput }: DateRangeTabsProps) {
  // NOTE: can memoize this
  const datePresets = [
    { dateRange: "3M", start: createDate(3), end: createDate(0) },
    { dateRange: "6M", start: createDate(6), end: createDate(0) },
    { dateRange: "YTD", start: createDate(12), end: createDate(0) },
    { dateRange: "3Y", start: createDate(36), end: createDate(0) },
    { dateRange: "5Y", start: createDate(60), end: createDate(0) },
    { dateRange: "10Y", start: createDate(120), end: createDate(0) },
  ];

  // if date chosen matches preset, select that tab
  const chosenPreset = () => {
    const preset = datePresets.find(
      (preset) => userInput.start == preset.start && userInput.end == preset.end
    )?.dateRange;

    return preset ? preset : "";
  };

  return (
    <Tabs value={chosenPreset()}>
      <TabsList>
        {datePresets.map((preset) => (
          <TabsTrigger
            key={preset.dateRange}
            value={preset.dateRange}
            onClick={() =>
              setUserInput((prev) => ({
                ...prev,
                start: preset.start,
                end: preset.end,
              }))
            }
          >
            {preset.dateRange}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
