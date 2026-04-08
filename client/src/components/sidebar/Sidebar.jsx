import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { dummyProfileData } from "../../assets/assets";
import {
  ArrowDownRight,
  Calendar,
  ChevronRight,
  DollarSign,
  FileTextIcon,
  LayoutGridIcon,
  LogOut,
  Menu,
  Settings,
  UserIcon,
  XIcon,
} from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [username, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // setUserName(dummyProfileData.firstName);
    setUserName(`${dummyProfileData.firstName} ${dummyProfileData.lastName}`);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const role = "ADMIN";
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    ...(role === "ADMIN"
      ? [{ name: "Employees", href: "/employees", icon: UserIcon }]
      : [{ name: "Attendance", href: "/attendance", icon: Calendar }]),
    { name: "Leave", href: "/leave", icon: FileTextIcon },
    { name: "Payslips", href: "/payslips", icon: DollarSign },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const sidebarContent = (
    <>
      {/* Brand header */}
      <div className="flex items-center justify-start p-4 gap-4 border-b">
        <UserIcon size={32} />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Employee MS</p>
          <p className="text-surface-secondary text-sm">Management System</p>
        </div>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden">
          <XIcon />
        </button>
      </div>

      {/* User profile */}
      {username && (
        <div className="bg-primary m-4 rounded-xl">
          <div className="flex items-center gap-4 px-4 py-2">
            <div className="w-9 h-9 rounded-full flex shrink-0 bg-primary-hover items-center justify-center">
              <span>{username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="">
              <p className="tracking-wide text-lg">{username}</p>
              <p className="text-surface-secondary text-sm">
                {role === "ADMIN" ? "Admin" : "Employee"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              to={item.href}
              key={item.href}
              className={`flex items-center justify-between p-4 hover:bg-primary ${isActive && "bg-primary-hover"}`}
            >
              <div className="flex items-center gap-4">
                <item.icon />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight />}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="border-t mt-auto p-4">
        <button
          className="flex items-center gap-2 justify-center w-full p-2 rounded-2xl bg-primary-hover hover:bg-warning group"
          onClick={handleLogout}
        >
          <p className="group-hover:text-warning-accent">Logout</p>
          <LogOut size={18} className="group-hover:text-warning-accent" />
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="z-50">
        <button
          className="fixed lg:hidden top-4 left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center border border-border"
          onClick={() => setMobileOpen(true)}
        >
          <Menu />
        </button>

        {mobileOpen && (
          <div
            className="fixed lg:hidden top-0 left-0 w-full h-screen bg-gray-900 opacity-50"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* <aside className="hidden lg:flex flex-col h-full w-64 bg-surface">
          {sidebarContent}
        </aside>

        <aside
          className={`lg:hidden fixed top-0 left-0 w-72 h-full bg-surface  ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {sidebarContent}
        </aside> */}

        <aside
          className={`h-full w-64 bg-surface transform transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} fixed lg:static lg:translate-x-0 flex flex-col gap-2`}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
