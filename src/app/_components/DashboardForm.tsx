"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useUserInputStore } from "@/lib/stores";

import { useGetDcaReturns } from "@/queries/dcaReturns";

import { DcaReturnsQueryInput } from "@/types/financialQueries";
import { DcaReturnsQueryInputSchema } from "@/schemas/financialQueries";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function DashboardForm() {
  const userInput = DcaReturnsQueryInputSchema.parse(useUserInputStore());
  const setUserInput = useUserInputStore((state) => state.update);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DcaReturnsQueryInputSchema),
    defaultValues: userInput,
  });

  const { isLoading, isError } = useGetDcaReturns(userInput);

  function onSubmit(data: DcaReturnsQueryInput) {
    setUserInput(data);
  }

  // programatically show updated date in the input boxes if user clicks on the preset date ranges
  setValue("start", userInput.start);
  setValue("end", userInput.end);

  return (
    <form
      className="grid grid-cols-1 md:grid-rows-3 md:grid-flow-col items-end gap-x-2 gap-y-0.5"
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

      <Label htmlFor="contribution" className="mt-3">
        Monthly Contribution
      </Label>
      <Input
        id="contribution"
        type="number"
        placeholder="USD"
        {...register("contri", {
          valueAsNumber: true,
        })}
      />
      <div className="place-self-start">
        {errors.contri && (
          <span className="text-red-600 text-sm">{errors.contri.message}</span>
        )}
      </div>

      <Label htmlFor="start" className="mt-3">
        From
      </Label>
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

      <Label htmlFor="end" className="mt-3">
        To
      </Label>
      <Input id="end" type="date" {...register("end", { required: true })} />
      <div className="place-self-start">
        {errors.end && (
          <span className="text-red-600 text-sm">{errors.end.message}</span>
        )}
      </div>

      <div className="row-span-3 place-self-center justify-self-start">
        <Button type="submit" disabled={isLoading || isError}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Generate"}
        </Button>
      </div>
    </form>
  );
}
