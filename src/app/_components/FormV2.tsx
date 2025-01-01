"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  ticker: z.string().toUpperCase().nonempty("Enter a ticker"),
  contri: z
    .number({
      required_error: "Enter a number",
      invalid_type_error: "Enter a number",
    })
    .positive(),
  startDate: z.string().date().nonempty(),
  endDate: z.string().date().nonempty(),
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
      contri: 50,
      startDate: "2024-01-01",
      endDate: "2024-12-01",
    },
  });

  function onSubmit(data: FormProps) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="ticker">Ticker</Label>
        <Input id="ticker" placeholder="Ticker" {...register("ticker")} />
        {errors.ticker && <p>{errors.ticker.message}</p>}
      </div>

      <div>
        <Label htmlFor="contribution">Contribution</Label>
        <Input
          id="contribution"
          type="number"
          placeholder="USD"
          step=".01"
          {...register("contri", {
            valueAsNumber: true,
          })}
        />
        {errors.contri && <p>{errors.contri.message}</p>}
      </div>

      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          {...register("startDate", { required: true })}
        />
        {errors.startDate && <p>{errors.startDate.message}</p>}
      </div>

      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          {...register("endDate", { required: true })}
        />
        {errors.endDate && <p>{errors.endDate.message}</p>}
      </div>

      <Button type="submit">Generate</Button>
    </form>
  );
}
