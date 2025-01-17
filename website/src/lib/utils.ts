import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createDate = (monthsToSubtract: number) => {
  const today = new Date();
  const monthsAgoDate = new Date();
  monthsAgoDate.setMonth(today.getMonth() - monthsToSubtract);

  return String(monthsAgoDate.getFullYear()).concat(
    '-',
    String(monthsAgoDate.getMonth() + 1).padStart(2, '0'),
    '-',
    String(monthsAgoDate.getDate()).padStart(2, '0'),
  );
};

export function buildUrlWithParamsObj(
  url: string,
  params: Record<string, string | number | boolean | undefined | null>,
) {
  const newUrl = url.concat('?');
  let paramsArr: string[] = [];

  for (const [key, val] of Object.entries(params)) {
    if (val) {
      paramsArr = [...paramsArr, `${key}=${val.toString()}`];
    }
  }

  return newUrl.concat(paramsArr.join('&'));
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateNoDay(date: Date) {
  return date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
}

export function formatNumber(num: number) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
export function formatPrice(price: number) {
  return priceFormatter.format(price);
}
