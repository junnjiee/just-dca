"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  ticker: z.string(),
  amount: z.number(),
  startDate: z.string().date(),
  endDate: z.string().date(),
});

type FormProps = z.infer<typeof formSchema>;

export function FormV2() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "AAPL",
      amount: 50,
      startDate: "2024-01-01",
      endDate: "2024-12-01",
    },
  });

  function onSubmit(data: FormProps) {
    console.log(data);
  }

  return (
    <form>
      <div>
        <label htmlFor="ticker">ticker</label>
        <Input id="ticker" placeholder="Ticker" {...register("ticker")} />
        {errors.ticker && <p>{errors.ticker.message}</p>}
      </div>
    </form>
  );
}
