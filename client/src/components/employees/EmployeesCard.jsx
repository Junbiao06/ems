import { Pencil, Trash2 } from "lucide-react";

const EmployeesCard = ({ employee, onEdit, onDelete }) => {
  return (
    <div className="group animate-fade-in transition-all duration-500 hover:-translate-y-2 rounded-2xl">
      <div className="relative">
        <div className="aspect-4/3">
          <div className="w-full h-full flex justify-center items-center bg-primary rounded-2xl rounded-b-none group-hover:blur-[2px]">
            <div className=" w-20 h-20 bg-primary-hover rounded-full flex justify-center items-center text-xl group-hover:bg-surface transition-colors animate-fade-in duration-500 gap-0.5">
              <p>{employee.firstName.charAt(0).toUpperCase()}</p>
              <p>{employee.lastName.charAt(0).toUpperCase()}</p>
            </div>
          </div>
        </div>
        <div className="hidden group-hover:flex absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center gap-6">
          <button
            className="bg-background rounded-lg p-2 cursor-pointer hover:text-surface"
            onClick={() => onEdit(employee)}
          >
            <Pencil />
          </button>
          <button
            className="bg-background rounded-lg p-2 cursor-pointer hover:text-warning"
            onClick={onDelete}
          >
            <Trash2 />
          </button>
        </div>
      </div>

      <div className="bg-primary-hover p-2 rounded-2xl -my-2 rounded-t-none ">
        <h3 className="flex items-baseline gap-2">
          <p className="text-lg truncate">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="bg-border group-hover:bg-surface text-xs rounded-2xl px-2 truncate hidden xl:block transition-colors animate-fade-in duration-300">
            {employee.department}
          </p>
        </h3>
        <p className="text-secondary">{employee.position}</p>
      </div>
    </div>
  );
};

export default EmployeesCard;
