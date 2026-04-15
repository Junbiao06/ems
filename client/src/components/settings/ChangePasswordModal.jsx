import { X, Eye, EyeOff } from "lucide-react";
import { useMemo, useReducer } from "react";
import { changePasswordSchema } from "./passwordSchema";

const initialState = {
  values: { currentPassword: "", newPassword: "", confirmPassword: "" },
  show: { current: false, new: false, confirm: false },
  touched: { currentPassword: false, newPassword: false, confirmPassword: false },
  submitted: false,
  loading: false,
  message: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_VALUE":
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case "TOGGLE_SHOW":
      return { ...state, show: { ...state.show, [action.field]: !state.show[action.field] } };
    case "BLUR":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case "SET_SUBMITTED":
      return { ...state, submitted: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_MESSAGE":
      return { ...state, message: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const ChangePasswordModal = ({ open, onClose }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { values, show, touched, submitted, loading, message } = state;

  const validation = useMemo(() => changePasswordSchema.safeParse(values), [values]);

  const getFieldError = (name) => {
    if (validation.success) return undefined;
    const issue = validation.error.issues.find((i) => i.path?.[0] === name);
    return issue?.message;
  };

  const shouldShowError = (name) => (touched[name] || submitted) && !!getFieldError(name);

  const resetForm = () => dispatch({ type: "RESET" });

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTED", value: true });
    dispatch({ type: "SET_MESSAGE", value: "" });

    const parsed = changePasswordSchema.safeParse(values);
    if (!parsed.success) return; // Only show red/error messages when invalid

    dispatch({ type: "SET_LOADING", value: true });
    // TODO: replace with real API call
    setTimeout(() => {
      dispatch({ type: "SET_LOADING", value: false });
      dispatch({ type: "SET_MESSAGE", value: "Password updated successfully!" });
      // Optional: auto-close after success
      // setTimeout(handleClose, 800);
    }, 600);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-background rounded-2xl p-6 md:p-8 w-full max-w-150 shadow-2xl max-h-150 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-8">
          <div className="my-2 md:my-4">
            <h2 className="text-2xl md:text-3xl">Change Password</h2>
          </div>

          <button className="cursor-pointer" onClick={handleClose} aria-label="Close">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {message && <div className="text-green-600 text-sm">{message}</div>}

          <div className="grid grid-cols-1 gap-4">
            {/* Current password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">Current Password</label>
              <div className="relative">
                <input
                  type={show.current ? "text" : "password"}
                  autoComplete="current-password"
                  className={`w-full pr-10 ${shouldShowError("currentPassword") ? "border border-red-500" : ""}`}
                  value={values.currentPassword}
                  onChange={(e) =>
                    dispatch({ type: "SET_VALUE", field: "currentPassword", value: e.target.value })
                  }
                  onBlur={() => dispatch({ type: "BLUR", field: "currentPassword" })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-secondary"
                  onClick={() => dispatch({ type: "TOGGLE_SHOW", field: "current" })}
                  aria-label={show.current ? "Hide current password" : "Show current password"}
                >
                  {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {shouldShowError("currentPassword") && (
                <p className="text-sm text-red-600">{getFieldError("currentPassword")}</p>
              )}
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">New Password</label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  autoComplete="new-password"
                  className={`w-full pr-10 ${shouldShowError("newPassword") ? "border border-red-500" : ""}`}
                  value={values.newPassword}
                  onChange={(e) => dispatch({ type: "SET_VALUE", field: "newPassword", value: e.target.value })}
                  onBlur={() => dispatch({ type: "BLUR", field: "newPassword" })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-secondary"
                  onClick={() => dispatch({ type: "TOGGLE_SHOW", field: "new" })}
                  aria-label={show.new ? "Hide new password" : "Show new password"}
                >
                  {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {shouldShowError("newPassword") && (
                <p className="text-sm text-red-600">{getFieldError("newPassword")}</p>
              )}
            </div>

            {/* Confirm new password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">Confirm New Password</label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  autoComplete="new-password"
                  className={`w-full pr-10 ${shouldShowError("confirmPassword") ? "border border-red-500" : ""}`}
                  value={values.confirmPassword}
                  onChange={(e) =>
                    dispatch({ type: "SET_VALUE", field: "confirmPassword", value: e.target.value })
                  }
                  onBlur={() => dispatch({ type: "BLUR", field: "confirmPassword" })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-secondary"
                  onClick={() => dispatch({ type: "TOGGLE_SHOW", field: "confirm" })}
                  aria-label={show.confirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {shouldShowError("confirmPassword") && (
                <p className="text-sm text-red-600">{getFieldError("confirmPassword")}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-2xl bg-primary-hover hover:bg-primary text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-2xl bg-surface hover:bg-surface/70 disabled:opacity-60 text-sm cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-3 border-border border-t-primary rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
