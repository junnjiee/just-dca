"use client";

import { useState } from "react";
import { DCAInfoForm } from "./components/DCAInfoForm";

export default function Home() {
  return (
    <>
      <div className="my-5">
        <DCAInfoForm />
      </div>
    </>
  );
}
