// app/dashboard/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import AdminDashboard from "./admin/page";
import HODDashboard from "./hod/page";
import StaffDashboard from "./staff/page";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = session.user?.role || "STAFF";

  switch (userRole) {
    case "ADMIN":
      return <AdminDashboard />;
    case "HOD":
      return <HODDashboard />;
    case "STAFF":
    default:
      return <StaffDashboard />;
  }
}
