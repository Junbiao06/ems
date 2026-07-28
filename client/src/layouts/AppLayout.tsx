import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";

export function AppLayout() {
  return (
    <div className="flex min-h-svh w-full max-w-full overflow-x-hidden bg-canvas">
      <a
        className="fixed left-4 top-4 z-80 -translate-y-20 rounded-lg bg-text px-4 py-3 text-sm font-bold text-surface shadow-lg transition focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>
      <Sidebar />
      <main
        className="min-w-0 flex-1 p-4 pt-20 outline-none sm:p-6 sm:pt-20 lg:ml-64 lg:p-8 lg:pt-8 xl:p-10"
        id="main-content"
        tabIndex={-1}
      >
        <Outlet />
      </main>
    </div>
  );
}
