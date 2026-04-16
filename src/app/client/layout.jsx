"use client";

import { DashboardMobileProvider } from "@/contexts/DashboardMobileContext";
import RouteGuard from "../../../components/auth/RouteGuard";

export default function ClientLayout({ children }) {
  return (
    <RouteGuard allowedRole="client">
      <DashboardMobileProvider>{children}</DashboardMobileProvider>
    </RouteGuard>
  );
}
