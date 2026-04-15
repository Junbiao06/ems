import { useState } from "react";

const ProfileForm = ({ initData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Simulate API
    setTimeout(() => {
      setLoading(false);
      setMessage("Profile updated successfully!");
      onSuccess && onSuccess();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-2">
      <div className="px-4">
        <div className="space-y-4">
          <h3 className="text-2xl pt-4">Profile Information</h3>
          <div>
            {message && <div className="text-green-600 text-sm">{message}</div>}
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label>Name</label>
              <input
                disabled
                className="text-secondary cursor-not-allowed"
                defaultValue={initData?.firstName + " " + initData?.lastName}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Email</label>
              <input
                disabled
                className="text-secondary cursor-not-allowed"
                defaultValue={initData?.email}
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label>Position</label>
              <input disabled className="text-secondary cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            type="submit"
            disabled={loading}
            className="bg-surface hover:bg-surface/70 rounded-2xl px-4 py-2"
          >
            {loading ? (
              <p className="flex justify-center items-center gap-3">
                <div className="w-6 h-6 border-3 border-border border-t-primary rounded-full animate-spin" />
                <p>Processing...</p>
              </p>
            ) : (
              <p>Update Profile</p>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
