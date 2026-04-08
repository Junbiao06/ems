import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative p-8 pt-18 sm:pt-12">
        {/* <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-400 mx-auto"> */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
