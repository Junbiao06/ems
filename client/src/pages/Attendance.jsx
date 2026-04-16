import { useCallback, useEffect, useState } from "react";
import Loading from "../components/ui/Loading";
import { dummyAttendanceData } from "../assets/assets";
import CheckInButton from "../components/attendance/CheckInButton";
import AttendanceStats from "../components/attendance/AttendanceStats";
import AttendanceHistory from "../components/attendance/AttendanceHistory";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const fetchData = useCallback(async () => {
    setHistory(dummyAttendanceData);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loading />;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRecord = history.find((item) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate.getTime() === today.getTime();
  });

  return (
    <div className="animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl">Employees</h1>
        <div className="text-secondary">
          Tracking your work hours and daily check-ins.
        </div>
      </div>
      {isDeleted ? (
        <div className="">
          <p>
            You can no longer check in or out because your account has been
            deleted.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          <CheckInButton todayRecord={todayRecord} onAction={fetchData} />
          <AttendanceStats history={history} />
          <AttendanceHistory history={history} />
        </div>
      )}
    </div>
  );
};

export default Attendance;
