import { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS, dummyEmployeeData } from "../assets/assets";
import { Plus, Search } from "lucide-react";
import Loading from "../components/ui/Loading";
import EmployeesCard from "../components/employees/EmployeesCard";
import CreateEmployeeModal from "../components/employees/CreateEmployeeModal";
import EditEmployeeModal from "../components/employees/EditEmployeeModal";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const departments = DEPARTMENTS;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setEmployees(dummyEmployeeData);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered =
    selectedDepartment === ""
      ? employees
      : employees.filter((item) => item.department === selectedDepartment);

  const filteredSearch =
    searchValue === ""
      ? filtered
      : filtered.filter(
          (item) =>
            item.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.lastName.toLowerCase().includes(searchValue.toLowerCase()),
        );

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl">Employees</h1>
          <div className="text-secondary">Manage your team members.</div>
        </div>
        <button
          className="flex items-center gap-x-2 rounded-2xl bg-surface px-4 py-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus />
          <p className="text-lg">Add Employee</p>
        </button>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row pt-12">
        <div className="bg-primary flex flex-1 rounded-2xl items-center  px-4">
          <Search />
          <input
            placeholder="Search employees..."
            className="bg-primary outline-none focus:outline-none
            focus:ring-0 focus:border-transparent placeholder:text-lg text-lg"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="bg-primary max-w-64 text-lg rounded-xl"
        >
          <option value="">All Departments</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4">
        {loading ? (
          <Loading />
        ) : filteredSearch.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div className="">
            <div className="">
              <p>There are {filtered.length} results.</p>
            </div>
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredSearch.map((item) => (
                <EmployeesCard
                  key={item.id}
                  employee={item}
                  onEdit={(e) => setEditEmployee(e)}
                  onDelete={fetchEmployees}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateEmployeeModal
          editEmployee={editEmployee}
          setEditEmployee={setEditEmployee}
          setShowCreateModal={setShowCreateModal}
          fetchEmployees={fetchEmployees}
        />
      )}

      {editEmployee && (
        <EditEmployeeModal
          editEmployee={editEmployee}
          setEditEmployee={setEditEmployee}
          fetchEmployees={fetchEmployees}
        />
      )}
    </div>
  );
};

export default Employees;
