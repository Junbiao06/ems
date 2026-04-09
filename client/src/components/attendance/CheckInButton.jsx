import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";

const CheckInButton = ({ todayRecord, onAction }) => {
  const [loading, setLoading] = useState(false);
  const handleAttendance = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAction();
    }, 1000);
  };

  if (todayRecord?.checkOut) {
    return (
      <div className="">
        <h3>Work Day Completed.</h3>
        <p>See you tomorrow!</p>
      </div>
    );
  }

  const isCheckedIn = !!todayRecord?.isCheckedIn;
  return (
    <div className="">
      <button
        onClick={handleAttendance}
        disabled={loading}
        className={`z-10 fixed bottom-6 right-6 flex justify-center items-center bg-surface/95 rounded-xl p-4 gap-2 hover:bg-surface active:scale-96  cursor-pointer animate-fade-in transition-all `}
      >
        {loading ? (
          <div className="w-6 h-6 border-3 border-border border-t-primary rounded-full animate-spin" />
        ) : isCheckedIn ? (
          <LogOut size={24} />
        ) : (
          <LogIn size={24} />
        )}

        <div className="flex flex-col items-center justify-center ml-2">
          <h2 className="text-xl">
            {loading ? "Processing..." : isCheckedIn ? "Clock Out" : "Clock In"}
          </h2>
          <p className="text-sm text-secondary">
            {isCheckedIn ? "Click to end your shift" : "start your work day"}
          </p>
        </div>
      </button>
    </div>
  );
};

export default CheckInButton;
