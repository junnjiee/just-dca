"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";

const formSchema = z.object({
  ticker: z.string(),
  // amount: z.number(),
  amount: z.string(),
  startDate: z.string().date(),
  endDate: z.string().date(),
});

export function DCAInfoForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "AAPL",
      amount: "50",
      // amount: 50,
      startDate: "2024-01-01",
      endDate: "2024-12-01",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-x-4"
      >
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem className="w-1/12">
              <FormControl>
                <Input placeholder="Ticker" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-1/12">
              <FormControl>
                <Input placeholder="Recurring Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DatePickerWithRange />
        <Button type="submit">Generate</Button>
      </form>
    </Form>
  );
}
