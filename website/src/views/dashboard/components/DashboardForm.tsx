import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, FileChartColumnIcon } from "lucide-react";
import { useBoolean, useMediaQuery } from "usehooks-ts";

import { createDate, cn } from "@/lib/utils";

import { useUserInput, useUserInputDispatch } from "@/contexts/user-input/context";

import { DcaReturnsQueryInput } from "@/types/financial-queries";
import { DcaReturnsQueryInputSchema } from "@/schemas/financial-queries";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type FormButtonProps = {
  className?: string;
};

export function FormButton({ className }: FormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { value: dialogOpen, setFalse, toggle } = useBoolean(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={dialogOpen} onOpenChange={toggle}>
        <DialogTrigger asChild className={className} disabled={isPending}>
          <Button>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                <p>Loading</p>
              </>
            ) : (
              <>
                <FileChartColumnIcon />
                <p>Enter Info</p>
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calculate Returns</DialogTitle>
            <DialogDescription>
              Calculate DCA returns for any stock or cryptocurrency on{" "}
              <a
                href="https://finance.yahoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Yahoo Finance
              </a>
              .
            </DialogDescription>
            <DialogDescription>
              To avoid errors, follow Yahoo Finance's ticker format. e.g. to
              search for <span className="font-medium">VWRA</span>, use{" "}
              <span className="font-medium">VWRA.L</span> instead.
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

  return (
    <Drawer open={dialogOpen} onOpenChange={toggle}>
      <DrawerTrigger
        asChild
        disabled={isPending}
        className={cn(
          "z-50 absolute fixed bottom-5 right-5 w-16 h-16 rounded-full",
          isPending && "w-32 h-12"
        )}
      >
        <Button>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              <p>Loading</p>
            </>
          ) : (
            <FileChartColumnIcon className="scale-150" />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Calculate Returns</DrawerTitle>
          <DrawerDescription>
            Calculate DCA returns for any stock or cryptocurrency on{" "}
            <a
              href="https://finance.yahoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Yahoo Finance
            </a>
            .
          </DrawerDescription>
          <DrawerDescription>
            To avoid errors, follow Yahoo Finance's ticker format. e.g. to
            search for <span className="font-medium">VWRA</span>, use{" "}
            <span className="font-medium">VWRA.L</span> instead.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="mb-5">
          <DashboardForm
            startTransition={startTransition}
            closeDialog={setFalse}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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
      className="grid grid-cols-1 gap-y-2.5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <Label htmlFor="ticker">Ticker</Label>
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

      <div className="justify-self-center">
        <Button type="submit">Calculate</Button>
      </div>
    </form>
  );
}
