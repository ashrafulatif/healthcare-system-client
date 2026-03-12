import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import React from "react";

const RootDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* dashboard sidebar */}
      <DashboardSidebar />
      <div className="flext flex-1 flex-col overflow-hidden">
        {/* DashboardNavbar */}
        <DashboardNavbar />
        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default RootDashboardLayout;
