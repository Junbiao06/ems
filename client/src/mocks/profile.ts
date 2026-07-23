import type { MockAuthUser } from "./auth";
import { mockEmployees } from "./employees";
import {
  AdminProfileSchema,
  EmployeeProfileSchema,
  ProfileSchema,
  type Profile,
} from "@/types/profile";

let mockAdminProfile = AdminProfileSchema.parse({
  kind: "ADMIN",
  id: "admin_001",
  email: "admin@ems.test",
  displayName: "Avery Chen",
});

let mockEmployeeProfile = EmployeeProfileSchema.parse({
  kind: "EMPLOYEE",
  id: "emp_005",
  firstName: "Jordan",
  lastName: "Lee",
  email: "jordan.lee@company.com",
  phone:
    mockEmployees.find((employee) => employee.id === "emp_005")?.phone ??
    "13500000000",
  department: "Operations",
  position: "Operations Coordinator",
  bio: "",
});

export function getMockProfile(user: MockAuthUser): Profile {
  return user.role === "ADMIN"
    ? { ...mockAdminProfile }
    : { ...mockEmployeeProfile };
}

export function updateMockProfile(profile: Profile) {
  const validatedProfile = ProfileSchema.parse(profile);

  if (validatedProfile.kind === "ADMIN") {
    mockAdminProfile = validatedProfile;
    return;
  }

  mockEmployeeProfile = validatedProfile;
}
