const LoginSection = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-surface min-h-screen">
      <div className="flex flex-col justify-center gap-4 px-20 pb-10">
        <div className="flex flex-col text-4xl lg:text-5xl font-semibold gap-2">
          <span>Employee</span>
          <span>Management System</span>
        </div>
        <p
          className="
        text-2xl text-surface-secondary
        "
        >
          Streamline your workforce oparations, track attendence, and manage
          payroll, and empower your team securely.
        </p>
      </div>
    </div>
  );
};

export default LoginSection;
