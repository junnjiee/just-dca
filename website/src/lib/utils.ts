import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createDate = (monthsToSubtract: number) => {
  const today = new Date();
  const monthsAgoDate = new Date();
  monthsAgoDate.setMonth(today.getMonth() - monthsToSubtract);

  return String(monthsAgoDate.getFullYear()).concat(
    "-",
    String(monthsAgoDate.getMonth() + 1).padStart(2, "0"),
    "-",
    String(monthsAgoDate.getDate()).padStart(2, "0"),
  );
};

export function buildUrlWithParamsObj(
  url: string,
  params: Record<string, string | number | boolean | undefined | null>,
) {
  const newUrl = url.concat("?");
  let paramsArr: string[] = [];

  for (const [key, val] of Object.entries(params)) {
    if (val) {
      paramsArr = [...paramsArr, `${key}=${val.toString()}`];
    }
  }

  return newUrl.concat(paramsArr.join("&"));
}

// Formatters
export function formatDateNoDay(
  dateStr: string,
  year: "2-digit" | "numeric" = "2-digit",
) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: year,
  });
}

export function formatNumberString(num: number) {
  if (num < 1) {
    return num.toPrecision(2);
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPctString(num: number) {
  return num.toLocaleString("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPriceString(num: number) {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
