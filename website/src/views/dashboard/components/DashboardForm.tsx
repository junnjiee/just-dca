import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useUserInput, useUserInputDispatch } from "@/contexts/user-input";

import { DcaReturnsQueryInput } from "@/types/financial-queries";
import { DcaReturnsQueryInputSchema } from "@/schemas/financial-queries";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function DashboardForm() {
  const userInput = useUserInput();
  const userInputDispatch = useUserInputDispatch();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DcaReturnsQueryInputSchema),
    defaultValues: userInput,
  });

  function onSubmit(data: DcaReturnsQueryInput) {
    startTransition(() => userInputDispatch({ type: "update", input: data }));
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
      <Input id="ticker" placeholder="e.g. AAPL" {...register("ticker")} />
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
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Generate"}
        </Button>
      </div>
    </form>
  );
}
