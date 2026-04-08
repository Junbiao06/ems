import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LoginSection from "../../components/login/LoginSection";

const portalOptions = [
  {
    to: "/login/admin",
    title: "Admin Portal",
    subtitle:
      "Manage employees, departments, and payroll and system configuration.",
  },
  {
    to: "/login/employee",
    title: "Employee Portal",
    subtitle: "View your profile, track your attendance and access payslips.",
  },
];

const LoginLanding = () => {
  return (
    <div className="flex min-h-screen ">
      <LoginSection />
      <div className="flex flex-1 flex-col px-16 md:px-24 xl:px-36 justify-center gap-12 lg:pb-24">
        <div className="space-y-3">
          <h2 className="text-4xl">Welcome</h2>
          <p className="text-secondary text-xl">
            Select your portal to access the system.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {portalOptions.map((item) => {
            return (
              <Link
                to={item.to}
                key={item.to}
                className="bg-primary p-6 py-4 border  border-border rounded-xl w-full hover:bg-primary-hover"
              >
                <div className="flex justify-between">
                  <span className="text-xl">{item.title}</span>
                  <ArrowRight />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-secondary text-sm flex flex-col items-end">
          <p className="pr-2">© 2026 junbiao.All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginLanding;
