import { z } from "zod";

export const errorSchema = z.object({
  detail: z.string(),
});

export function buildUrlWithParamsObj(
  url: string,
  params: Record<string, string | number | boolean | undefined | null>
) {
  let newUrl = url.concat("?");
  let paramsArr: string[] = [];

  for (const [key, val] of Object.entries(params)) {
    if (val) {
      paramsArr = [...paramsArr, `${key}=${val.toString()}`];
    }
  }

  return newUrl.concat(paramsArr.join("&"));
}
