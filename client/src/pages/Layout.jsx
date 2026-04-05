import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-400 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
