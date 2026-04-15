import { useCallback, useEffect, useState } from "react";
import { dummyProfileData } from "../assets/assets";
import { CloudSnow, LockIcon } from "lucide-react";
import ProfileForm from "../components/settings/ProfileForm";
import ChangePasswordModal from "../components/settings/ChangePasswordModal";

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setProfile(dummyProfileData);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="">
      <div className="animate-fade-in space-y-12">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl">Settings</h1>
            <div className="text-secondary">
              Manage your profile and account settings.
            </div>
          </div>
        </div>

        {profile && <ProfileForm initData={profile} onSuccess={fetchProfile} />}

        <div className="gap-8 bg-primary rounded-2xl max-w-md h-24 group overflow-hidden">
          <div className="w-full h-full group-hover:-translate-y-full transition duration-500">
            <div className="h-24 w-full flex items-center gap-4 p-6">
              <div className="rounded-md bg-primary-hover p-2 group-hover:bg-surface">
                <LockIcon />
              </div>
              <div className="">
                <div className="text-lg">Password</div>
                <p className="text-secondary text-md">
                  Update your account password.
                </p>
              </div>
              <div className="h-24 flex xl:hidden justify-center items-center gap-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-surface p-2 rounded-2xl text-xl cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
            <div className="h-24 w-full flex justify-center items-center gap-4 bg-primary-hover">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-surface p-2 rounded-2xl text-xl cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>

        <ChangePasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  );
};

export default Settings;
