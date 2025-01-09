import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createDate = (monthsToSubtract: number) => {
  const today = new Date();
  let monthsAgoDate = new Date();
  monthsAgoDate.setMonth(today.getMonth() - monthsToSubtract);

  return String(monthsAgoDate.getFullYear()).concat(
    "-",
    String(monthsAgoDate.getMonth() + 1).padStart(2, "0"),
    "-",
    String(monthsAgoDate.getDate()).padStart(2, "0")
  );
};

