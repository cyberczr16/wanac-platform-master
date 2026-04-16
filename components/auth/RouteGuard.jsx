"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * RouteGuard — prevents users from accessing pages that don't match their role.
 *
 * Usage:  <RouteGuard allowedRole="admin">  …admin pages…  </RouteGuard>
 *
 * How it works:
 *  1. Reads `wanacUser` from localStorage (same store the login page writes to).
 *  2. If the stored userType doesn't match `allowedRole`, the user is
 *     redirected to THEIR correct dashboard (or /login if not logged in).
 *  3. While checking, a lightweight loading spinner is shown so no
 *     protected content flashes on screen.
 */

const DASHBOARD_PATHS = {
  client: "/client/dashboard",
  coach: "/coach",
  admin: "/admin",
};

export default function RouteGuard({ allowedRole, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  function checkAuth() {
    setChecking(true);

    // 1. Is the user logged in at all?
    const token = localStorage.getItem("auth_token");
    const raw = localStorage.getItem("wanacUser");

    if (!token || !raw) {
      // Not logged in — send to login
      router.replace("/login");
      return;
    }

    // 2. Parse user data
    let user;
    try {
      user = JSON.parse(raw);
    } catch {
      // Corrupt data — clear and redirect
      localStorage.removeItem("auth_token");
      localStorage.removeItem("wanacUser");
      router.replace("/login");
      return;
    }

    const userRole = (user.userType || user.role || "").toLowerCase();

    // 3. Does the role match the required one for this route section?
    if (userRole !== allowedRole) {
      // Redirect to the user's own dashboard (or login if role is unknown)
      const correctPath = DASHBOARD_PATHS[userRole] || "/login";
      router.replace(correctPath);
      return;
    }

    // All good
    setAuthorized(true);
    setChecking(false);
  }

  // Loading state — keep it minimal so there's no flash of protected content
  if (checking && !authorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002147]" />
      </div>
    );
  }

  return authorized ? children : null;
}
