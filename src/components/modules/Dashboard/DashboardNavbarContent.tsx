"use client";

import { Input } from "@/components/ui/input";
import { NavSection } from "@/types/dashboard.type";
import { UserInfo } from "@/types/user.type";
import { Search } from "lucide-react";
import UserDropdown from "./UserDropdown";

interface DashboardNavbarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}
const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarProps) => {
  return (
    <div className="flex items-center gap-4 w-full px-4 py-3 border-b bg-background">
      {/* search component */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Search..." className="pl-9 pr-4" />
        </div>
      </div>

      {/* notidfication dropdown */}
      {/* user profile dropdown */}
      <UserDropdown userInfo={userInfo} />
    </div>
  );
};

export default DashboardNavbarContent;
