import type {
  ChangePasswordFormData,
  LoginFormData,
} from "@/types/auth";

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

let currentMockUser: MockAuthUser | null = null;

function accountUser(account: MockAuthAccount): MockAuthUser {
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    role: account.role,
  };
}

export function authenticateMockUser(input: LoginFormData): MockAuthUser | null {
  const account = mockLoginAccounts.find(
    (candidate) =>
      candidate.email === input.email && candidate.password === input.password,
  );

  if (!account) {
    return null;
  }

  return accountUser(account);
}

export function setCurrentMockUser(user: MockAuthUser) {
  currentMockUser = user;
}

export function getCurrentMockUser() {
  return currentMockUser ?? accountUser(mockLoginAccounts[0]);
}

export function clearCurrentMockUser() {
  currentMockUser = null;
}

export function changeMockPassword(
  user: MockAuthUser,
  input: ChangePasswordFormData,
) {
  const account = mockLoginAccounts.find(
    (candidate) => candidate.id === user.id,
  );

  if (!account || account.password !== input.currentPassword) {
    return false;
  }

  account.password = input.newPassword;
  return true;
}

export const mockRegistrationInvitation = {
  employeeName: "Jordan Lee",
  email: "jordan.lee@company.com",
  department: "Operations",
};
