"use client";

import RouteGuard from "../../../components/auth/RouteGuard";

export default function AdminLayout({ children }) {
  return <RouteGuard allowedRole="admin">{children}</RouteGuard>;
}
