import { createDate } from "@/lib/utils";
import { useUserInputStore } from "@/lib/stores";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChartDateRangeTabsProps = {
  className?: string;
};

export function ChartDateRangeTabs({ className }: ChartDateRangeTabsProps) {
  const currStart = useUserInputStore((state) => state.start);
  const currEnd = useUserInputStore((state) => state.end);
  const setDates = useUserInputStore((state) => state.updateDates);

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
      (preset) => currStart == preset.start && currEnd == preset.end
    )?.dateRange;

    return preset ? preset : "";
  };

  return (
    <Tabs value={chosenPreset()} className={className}>
      <TabsList className="w-full md:w-2/3 lg:w-1/2">
        {datePresets.map((preset) => (
          <TabsTrigger
            className="w-full"
            key={preset.dateRange}
            value={preset.dateRange}
            onClick={() => setDates(preset.start, preset.end)}
          >
            {preset.dateRange}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
