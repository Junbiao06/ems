import type { LoginFormData } from "../types/auth";

export type MockAuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
};

type MockAuthAccount = MockAuthUser & {
  password: string;
};

export const mockLoginAccounts: MockAuthAccount[] = [
  {
    id: "admin_001",
    fullName: "Avery Chen",
    email: "admin@ems.test",
    password: "demo1234",
    role: "ADMIN",
  },
  {
    id: "employee_001",
    fullName: "Jordan Lee",
    email: "employee@ems.test",
    password: "demo1234",
    role: "EMPLOYEE",
  },
];

export function authenticateMockUser(input: LoginFormData): MockAuthUser | null {
  const account = mockLoginAccounts.find(
    (candidate) =>
      candidate.email === input.email && candidate.password === input.password,
  );

  if (!account) {
    return null;
  }

  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    role: account.role,
  };
}

export const mockRegistrationInvitation = {
  employeeName: "Jordan Lee",
  email: "jordan.lee@company.com",
  department: "Operations",
};
