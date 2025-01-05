"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useGetDCAData,
  dcaDataInputSchema,
  dcaDataInputType,
} from "@/features/get-dca-data";

type DashboardFormProps = {
  userInput: dcaDataInputType;
  setUserInput: React.Dispatch<React.SetStateAction<dcaDataInputType>>;
};

export function DashboardForm({ userInput, setUserInput }: DashboardFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dcaDataInputSchema),
    defaultValues: userInput,
  });

  const { isLoading } = useGetDCAData(userInput);

  function onSubmit(data: dcaDataInputType) {
    setUserInput(data);
  }

  // programatically update date inputs if user clicks on the preset date ranges
  setValue("start", userInput.start);
  setValue("end", userInput.end);

  return (
    <form
      className="grid grid-rows-3 grid-flow-col items-end gap-x-2 gap-y-0.5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Label htmlFor="ticker">Ticker</Label>
      <Input id="ticker" placeholder="Ticker" {...register("ticker")} />
      <div className="place-self-start">
        {errors.ticker && (
          <span className="text-red-600 text-sm">{errors.ticker.message}</span>
        )}
      </div>

      <Label htmlFor="contribution">Monthly Contribution</Label>
      <Input
        id="contribution"
        type="number"
        placeholder="USD"
        // step=".01"
        {...register("contri", {
          valueAsNumber: true,
        })}
      />
      <div className="place-self-start">
        {errors.contri && (
          <span className="text-red-600 text-sm">{errors.contri.message}</span>
        )}
      </div>

      <Label htmlFor="start">From</Label>
      <Input
        id="start"
        type="date"
        {...register("start", { required: true })}
      />
      <div className="place-self-start">
        {errors.start && (
          <span className="text-red-600 text-sm">{errors.start.message}</span>
        )}
      </div>

      <Label htmlFor="end">To</Label>
      <Input id="end" type="date" {...register("end", { required: true })} />
      <div className="place-self-start">
        {errors.end && (
          <span className="text-red-600 text-sm">{errors.end.message}</span>
        )}
      </div>

      <div className="row-span-3 place-self-center justify-self-start">
        <Button type="submit">{isLoading ? "Loading" : "Generate"}</Button>
      </div>
    </form>
  );
}
