import {
  Calendar,
  ChevronRight,
  DollarSign,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { cn } from "../../utils/cn";

type NavigationItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  available: boolean;
};

export function Sidebar() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const employeeView = searchParams.get("role") === "employee";
  const user = employeeView
    ? { fullName: "Jordan Lee", role: "Employee" }
    : { fullName: "Avery Chen", role: "Administrator" };

  const navigationItems: NavigationItem[] = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutGrid, available: true },
    ...(employeeView
      ? [
          {
            label: "Attendance",
            path: "/attendance",
            icon: Calendar,
            available: false,
          },
        ]
      : [
          {
            label: "Employees",
            path: "/employees",
            icon: UserRound,
            available: true,
          },
        ]),
    { label: "Leave", path: "/leave", icon: FileText, available: false },
    { label: "Payslips", path: "/payslips", icon: DollarSign, available: false },
    { label: "Settings", path: "/settings", icon: Settings, available: false },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center gap-4 border-b border-sidebar-border p-4">
        <UserRound className="size-8 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-lg font-semibold">Employee MS</p>
          <p className="truncate text-sm text-sidebar-secondary">
            Management System
          </p>
        </div>
        <button
          className="ml-auto grid size-9 shrink-0 place-items-center lg:hidden"
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>

      <div className="m-4 rounded-xl bg-sidebar-panel">
        <div className="flex items-center gap-4 px-4 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-active font-medium">
            {user.fullName.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium tracking-wide">{user.fullName}</p>
            <p className="truncate text-xs text-sidebar-secondary">{user.role}</p>
          </div>
        </div>
      </div>

      <nav>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);
          const className = cn(
            "flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-sidebar-panel",
            isActive && "bg-sidebar-active",
          );
          const content = (
            <>
              <span className="flex items-center gap-4">
                <Icon className="size-6" aria-hidden="true" />
                <span>{item.label}</span>
              </span>
              {isActive ? <ChevronRight className="size-6" aria-hidden="true" /> : null}
            </>
          );

          if (!item.available) {
            return (
              <button
                className={className}
                type="button"
                key={item.path}
                aria-disabled="true"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              className={className}
              key={item.path}
              to={
                employeeView && item.path === "/dashboard"
                  ? "/dashboard?role=employee"
                  : item.path
              }
              onClick={() => setMobileOpen(false)}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border p-4">
        <Link
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-sidebar-active p-2 transition-colors hover:bg-sidebar-warning"
          to="/login"
        >
          <span className="group-hover:text-sidebar-warning-text">Logout</span>
          <LogOut
            className="size-[18px] group-hover:text-sidebar-warning-text"
            aria-hidden="true"
          />
        </Link>
      </div>
    </>
  );

  return (
    <div className="z-50 shrink-0">
      <button
        className="fixed left-4 top-4 z-30 flex size-12 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-panel lg:hidden"
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      {mobileOpen ? (
        <button
          className="fixed inset-0 z-40 bg-text/50 lg:hidden"
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-2 bg-sidebar text-text transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Main navigation"
      >
        {sidebarContent}
      </aside>
    </div>
  );
}
