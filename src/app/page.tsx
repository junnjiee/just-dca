"use client";

import { useState } from "react";
import { DCAInfoForm } from "./_components/DCAInfoForm";
import { DataCard } from "./_components/DataCard";
import { CustomLineChart } from "./_components/CustomLineChart";
import { DCADataTable } from "./_components/DCADataTable";

export default function Home() {
  return (
    <>
      <div className="my-5">
        <DCAInfoForm />
      </div>
      <div className="border-b px-4 py-3 space-y-0.5 mb-3">
        <div className="text-2xl">Apple Inc.</div>
        <div className="text-xs">AAPL &bull; NASDAQ</div>
      </div>
      <div className="flex flex-row gap-x-4 mb-3">
        <CustomLineChart className="basis-2/3" />
        <DataCard className="basis-1/3" />
      </div>
      <DCADataTable />
    </>
  );
}
