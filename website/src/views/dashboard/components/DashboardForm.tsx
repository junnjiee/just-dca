import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CircleAlertIcon } from "lucide-react";
import { useBoolean } from "usehooks-ts";

import { createDate } from "@/lib/utils";

import { useUserInput, useUserInputDispatch } from "@/contexts/user-input";

import { DcaReturnsQueryInput } from "@/types/financial-queries";
import { DcaReturnsQueryInputSchema } from "@/schemas/financial-queries";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DashboardFormButtonProps = {
  className?: string;
};

export function DashboardFormButton({ className }: DashboardFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { value: dialogOpen, setFalse, toggle } = useBoolean(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={toggle}>
      <DialogTrigger asChild className={className} disabled={isPending}>
        <Button>
          {isPending ? <Loader2 className="animate-spin" /> : "Search Ticker"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Ticker</DialogTitle>
          <DialogDescription>
            Calculate DCA returns for any stock or cryptocurrency, as long as it
            is available on Yahoo! Finance.
          </DialogDescription>
        </DialogHeader>
        <DashboardForm
          startTransition={startTransition}
          closeDialog={setFalse}
        />
      </DialogContent>
    </Dialog>
  );
}

type DashboardFormProps = {
  startTransition: React.TransitionStartFunction;
  closeDialog: () => void;
};

export function DashboardForm({
  startTransition,
  closeDialog,
}: DashboardFormProps) {
  const userInput = useUserInput();
  const userInputDispatch = useUserInputDispatch();
  const todayDate = createDate(0);

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
    closeDialog();
    startTransition(() => userInputDispatch({ type: "update", input: data }));
  }

  // programatically show updated date in the input boxes if user clicks on the preset date ranges
  setValue("start", userInput.start);
  setValue("end", userInput.end);

  return (
    <form
      className="grid grid-cols-1 gap-y-2"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <Label htmlFor="ticker">Ticker</Label>
        <Popover>
          <PopoverTrigger className="ms-1">
            <CircleAlertIcon width={"13"} height={"13"} />
          </PopoverTrigger>
          <PopoverContent>
            Follow Yahoo Finance's tickers. e.g. To search Bitcoin, use BTC-USD,
            not BTC.
          </PopoverContent>
        </Popover>
        <Input id="ticker" placeholder="e.g. AAPL" {...register("ticker")} />
        {errors.ticker && (
          <p className="text-red-600 text-sm">{errors.ticker.message}</p>
        )}
      </div>

      <div>
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
        {errors.contri && (
          <p className="text-red-600 text-sm">{errors.contri.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="start" className="mt-3">
          From
        </Label>
        <Input
          id="start"
          type="date"
          {...register("start", { required: true })}
          className="dark:[color-scheme:dark]"
          max={todayDate}
        />
        {errors.start && (
          <p className="text-red-600 text-sm">{errors.start.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="end" className="mt-3">
          To
        </Label>
        <Input
          id="end"
          type="date"
          {...register("end", { required: true })}
          className="dark:[color-scheme:dark]"
          max={todayDate}
        />
        {errors.end && (
          <p className="text-red-600 text-sm">{errors.end.message}</p>
        )}
      </div>

      <div>
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
