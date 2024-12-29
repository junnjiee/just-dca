"use client";

import { useState } from "react";
import { DCAInfoForm } from "./components/DCAInfoForm";
import { DataCard } from "./components/DataCard";

export default function Home() {
  return (
    <>
      <div className="my-5">
        <DCAInfoForm />
      </div>
      <div className="border-b px-4 py-3 space-y-0.5">
        <div className="text-2xl">Apple Inc.</div>
        <div className="text-xs">AAPL &bull; NASDAQ</div>
      </div>
    </>
  );
}
