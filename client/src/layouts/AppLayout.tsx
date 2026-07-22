import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";

export function AppLayout() {
  return (
    <div className="flex min-h-svh w-full max-w-full overflow-x-hidden bg-canvas">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 lg:ml-64 lg:p-8 lg:pt-8 xl:p-10">
        <Outlet />
      </main>
    </div>
  );
}
