import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets";
import Loading from "../components/ui/Loading";
import PayslipList from "../components/payslip/PayslipList";
import { Plus } from "lucide-react";
import GeneratePayslipModal from "../components/payslip/GeneratePayslipModal";

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = !false;
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const fetchPayslips = useCallback(async () => {
    setLoading(true);
    setPayslips(dummyPayslipData);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      setEmployees(dummyEmployeeData);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl">Payslips</h1>
          <div className="text-secondary">
            {isAdmin
              ? "Generate and manage employee payslips."
              : "Your payslip history."}
          </div>
        </div>
        {isAdmin && (
          <button
            className="flex items-center gap-x-2 rounded-2xl bg-surface px-4 py-2 cursor-pointer"
            onClick={() => setShowGenerateModal(true)}
          >
            <Plus />
            <p className="text-lg">Generate Payslip</p>
          </button>
        )}
      </div>

      <PayslipList payslips={payslips} isAdmin={isAdmin} />
      <GeneratePayslipModal
        employees={employees}
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onSuccess={() => setShowGenerateModal(false)}
      />
    </div>
  );
};

export default Payslips;
