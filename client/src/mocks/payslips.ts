import { mockEmployees } from "./employees";
import {
  PayslipRecordSchema,
  type PayslipEmployee,
  type PayslipRecord,
} from "@/types/payslip";

type PayslipSeed = {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalaryMinor: number;
  allowancesMinor: number;
  deductionsMinor: number;
  createdAt: string;
};

const generatedPayslipsStorageKey = "ems.mock.generated-payslips";

function employeeSnapshot(employeeId: string): PayslipEmployee {
  const employee = mockEmployees.find(
    (candidate) => candidate.id === employeeId,
  );

  if (!employee) {
    throw new Error(`Missing mock employee: ${employeeId}`);
  }

  return {
    id: employee.id,
    fullName: `${employee.firstName} ${employee.lastName}`,
    email: employee.email,
    department: employee.department,
    position: employee.position,
  };
}

const payslipSeeds = [
  {
    id: "pay_001",
    employeeId: "emp_001",
    month: 7,
    year: 2026,
    basicSalaryMinor: 1850000,
    allowancesMinor: 120000,
    deductionsMinor: 38400,
    createdAt: "2026-07-22T02:18:00.000Z",
  },
  {
    id: "pay_002",
    employeeId: "emp_003",
    month: 7,
    year: 2026,
    basicSalaryMinor: 1720000,
    allowancesMinor: 95000,
    deductionsMinor: 32600,
    createdAt: "2026-07-22T02:16:00.000Z",
  },
  {
    id: "pay_003",
    employeeId: "emp_005",
    month: 7,
    year: 2026,
    basicSalaryMinor: 1265000,
    allowancesMinor: 78000,
    deductionsMinor: 24500,
    createdAt: "2026-07-22T02:14:00.000Z",
  },
  {
    id: "pay_004",
    employeeId: "emp_006",
    month: 7,
    year: 2026,
    basicSalaryMinor: 1960000,
    allowancesMinor: 130000,
    deductionsMinor: 41200,
    createdAt: "2026-07-22T02:12:00.000Z",
  },
  {
    id: "pay_005",
    employeeId: "emp_007",
    month: 7,
    year: 2026,
    basicSalaryMinor: 1640000,
    allowancesMinor: 162000,
    deductionsMinor: 29800,
    createdAt: "2026-07-22T02:10:00.000Z",
  },
  {
    id: "pay_006",
    employeeId: "emp_009",
    month: 7,
    year: 2026,
    basicSalaryMinor: 1430000,
    allowancesMinor: 88000,
    deductionsMinor: 27100,
    createdAt: "2026-07-22T02:08:00.000Z",
  },
  {
    id: "pay_007",
    employeeId: "emp_011",
    month: 7,
    year: 2026,
    basicSalaryMinor: 2120000,
    allowancesMinor: 145000,
    deductionsMinor: 43600,
    createdAt: "2026-07-22T02:06:00.000Z",
  },
  {
    id: "pay_008",
    employeeId: "emp_012",
    month: 7,
    year: 2026,
    basicSalaryMinor: 1390000,
    allowancesMinor: 91000,
    deductionsMinor: 26500,
    createdAt: "2026-07-22T02:04:00.000Z",
  },
  {
    id: "pay_009",
    employeeId: "emp_005",
    month: 6,
    year: 2026,
    basicSalaryMinor: 1265000,
    allowancesMinor: 72000,
    deductionsMinor: 23800,
    createdAt: "2026-06-23T02:14:00.000Z",
  },
  {
    id: "pay_010",
    employeeId: "emp_001",
    month: 6,
    year: 2026,
    basicSalaryMinor: 1850000,
    allowancesMinor: 118000,
    deductionsMinor: 37900,
    createdAt: "2026-06-23T02:12:00.000Z",
  },
  {
    id: "pay_011",
    employeeId: "emp_006",
    month: 6,
    year: 2026,
    basicSalaryMinor: 1960000,
    allowancesMinor: 126000,
    deductionsMinor: 40700,
    createdAt: "2026-06-23T02:10:00.000Z",
  },
  {
    id: "pay_012",
    employeeId: "emp_005",
    month: 5,
    year: 2026,
    basicSalaryMinor: 1265000,
    allowancesMinor: 68000,
    deductionsMinor: 23100,
    createdAt: "2026-05-22T02:14:00.000Z",
  },
] satisfies PayslipSeed[];

const seededMockPayslips = PayslipRecordSchema.array().parse(
  payslipSeeds.map(({ employeeId, ...payslip }) => ({
    ...payslip,
    employee: employeeSnapshot(employeeId),
    netSalaryMinor:
      payslip.basicSalaryMinor +
      payslip.allowancesMinor -
      payslip.deductionsMinor,
    currency: "CNY",
  })),
);

function readGeneratedMockPayslips() {
  try {
    const storedValue = window.localStorage.getItem(
      generatedPayslipsStorageKey,
    );

    if (!storedValue) {
      return [];
    }

    const result = PayslipRecordSchema.array().safeParse(
      JSON.parse(storedValue),
    );

    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function saveGeneratedMockPayslips(payslips: PayslipRecord[]) {
  try {
    window.localStorage.setItem(
      generatedPayslipsStorageKey,
      JSON.stringify(payslips),
    );
  } catch {
    return;
  }
}

let generatedMockPayslips = readGeneratedMockPayslips();
let mockPayslipRecords = [
  ...generatedMockPayslips,
  ...seededMockPayslips,
];

export function getMockPayslips() {
  return [...mockPayslipRecords];
}

export function getMockPayslipById(payslipId: string) {
  return mockPayslipRecords.find((payslip) => payslip.id === payslipId);
}

export function addMockPayslip(payslip: PayslipRecord) {
  const validatedPayslip = PayslipRecordSchema.parse(payslip);
  generatedMockPayslips = [
    validatedPayslip,
    ...generatedMockPayslips.filter(
      (currentPayslip) => currentPayslip.id !== validatedPayslip.id,
    ),
  ];
  mockPayslipRecords = [validatedPayslip, ...mockPayslipRecords];
  saveGeneratedMockPayslips(generatedMockPayslips);
}
