"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { dcaDataInputSchema, dcaDataInputType } from "@/features/get-dca-data";

type DashboardFormProps = {
  userInput: dcaDataInputType;
  setUserInput: React.Dispatch<React.SetStateAction<dcaDataInputType>>;
};

export function DashboardForm({ userInput, setUserInput }: DashboardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<dcaDataInputType>({
    resolver: zodResolver(dcaDataInputSchema),
    defaultValues: {
      ticker: "AAPL",
      contri: 50,
      start: "2024-01-01",
      end: "2024-12-01",
    },
  });

  function onSubmit(data: dcaDataInputType) {
    // console.log(data);
    setUserInput(data);
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
        <Label htmlFor="start">Start Date</Label>
        <Input
          id="start"
          type="date"
          {...register("start", { required: true })}
        />
        {errors.start && <p>{errors.start.message}</p>}
      </div>

      <div>
        <Label htmlFor="end">End Date</Label>
        <Input id="end" type="date" {...register("end", { required: true })} />
        {errors.end && <p>{errors.end.message}</p>}
      </div>

      <Button type="submit">Generate</Button>
    </form>
  );
}
