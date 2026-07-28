import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { ChangePasswordForm } from "../../components/settings/ChangePasswordForm";
import { ProfileForm } from "../../components/settings/ProfileForm";
import {
  changeMockPassword,
  clearCurrentMockUser,
  getCurrentMockUser,
} from "../../mocks/auth";
import { getMockProfile, updateMockProfile } from "../../mocks/profile";
import type { ChangePasswordFormData } from "@/types/auth";
import type { Profile } from "@/types/profile";

export function SettingsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentMockUser();
  const [profile, setProfile] = useState<Profile>(() =>
    getMockProfile(currentUser),
  );

  function saveProfile(updatedProfile: Profile) {
    updateMockProfile(updatedProfile);
    setProfile(updatedProfile);
    toast.success("Profile updated successfully.");
  }

  function savePassword(password: ChangePasswordFormData) {
    const passwordChanged = changeMockPassword(currentUser, password);

    if (!passwordChanged) {
      return false;
    }

    clearCurrentMockUser();
    toast.success("Password changed. Sign in again.");
    navigate("/login", { replace: true });
    return true;
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        eyebrow="My account"
        title="Settings"
        description="Manage your profile and account information."
      />

      <section className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <header className="border-b border-border px-5 py-5 sm:px-7">
          <h2 className="text-xl font-extrabold text-text">
            Profile information
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Update the information you are allowed to manage.
          </p>
        </header>
        <ProfileForm profile={profile} onSubmit={saveProfile} />
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <header className="border-b border-border px-5 py-5 sm:px-7">
          <h2 className="text-xl font-extrabold text-text">Password</h2>
          <p className="mt-1 text-sm text-text-muted">
            Change your account password and sign in again.
          </p>
        </header>
        <ChangePasswordForm onSubmit={savePassword} />
      </section>
    </div>
  );
}
