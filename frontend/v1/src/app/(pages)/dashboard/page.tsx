// app/dashboard/page.tsx
"use client";

import { Suspense } from "react";
import DashboardContent from "@/components/DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
