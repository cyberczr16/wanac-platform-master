"use client";

import { DashboardMobileProvider } from "@/contexts/DashboardMobileContext";
import RouteGuard from "../../../components/auth/RouteGuard";

export default function CoachLayout({ children }) {
  return (
    <RouteGuard allowedRole="coach">
      <DashboardMobileProvider>{children}</DashboardMobileProvider>
    </RouteGuard>
  );
}
