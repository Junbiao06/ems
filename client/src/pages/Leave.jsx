import { useCallback, useEffect, useState } from "react";
import Loading from "../components/ui/Loading";
import {
  icons,
  PalmtreeIcon,
  Plus,
  ThermometerIcon,
  UmbrellaIcon,
} from "lucide-react";
import { dummyLeaveData } from "../assets/assets";
import LeaveHistory from "../components/leave/LeaveHistory";
import ApplyLeaveModal from "../components/leave/ApplyLeaveModal";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isAdmin = false;

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setLeaves(dummyLeaveData);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (loading) {
    return <Loading />;
  }

  const approvedLeaves = leaves.filter((item) => item.status === "APPROVED");
  const sickCount = approvedLeaves.filter(
    (item) => item.type === "SICK",
  ).length;
  const casualCount = approvedLeaves.filter(
    (item) => item.type === "CASUAL",
  ).length;
  const annualCount = approvedLeaves.filter(
    (item) => item.type === "ANNUAL",
  ).length;

  const leaveStats = [
    { label: "Sick Leaves", value: sickCount, icon: ThermometerIcon },
    { label: "Casual Leaves", value: casualCount, icon: UmbrellaIcon },
    { label: "Annual Leaves", value: annualCount, icon: PalmtreeIcon },
  ];

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl">Leaves</h1>
          <div className="text-secondary">
            {isAdmin
              ? "Manage leaves applications."
              : "Your leaves history and requests."}
          </div>
        </div>

        {!isAdmin && !isDeleted && (
          <button
            className="flex items-center gap-x-2 rounded-2xl bg-surface px-4 py-2 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Plus />
            <p className="text-lg">Apply for leave</p>
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {leaveStats.map((item, index) => (
            <div
              className="flex items-center justify-between gap-4 rounded-2xl p-6 relative bg-primary transition-all hover:-translate-y-2 duration-200 group overflow-hidden"
              key={index}
            >
              <div className="absolute inset-0 bottom-0 w-2 bg-secondary rounded-l-full group-hover:bg-surface" />
              <div className="flex flex-col">
                <div className="tracking-wider">{item.label}</div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <span>taken</span>
                </div>
              </div>
              <div className="bg-primary-hover rounded-full p-3 group-hover:bg-surface">
                <item.icon />
              </div>
            </div>
          ))}
        </div>
      )}

      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
      <ApplyLeaveModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchLeaves}
      />
    </div>
  );
};

export default Leave;
