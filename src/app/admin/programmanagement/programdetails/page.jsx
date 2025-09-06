import React, { Suspense } from "react";
import ProgramDetailsClient from "./ProgramDetailsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProgramDetailsClient />
    </Suspense>
  );
}
