import { Link } from "react-router-dom";
import { ArrowLeft, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useReducer, useState } from "react";
import LoginSection from "./LoginSection";

const reducer = (state, action) => {
  switch (action.type) {
    case "setEmail":
      return {
        ...state,
        email: action.payload,
      };
    case "setPassword":
      return {
        ...state,
        password: action.payload,
      };
    case "clear":
      return {
        ...state,
        email: "",
        password: "",
      };

    default:
      return state;
  }
};

const initState = { email: "", password: "" };

const LoginForm = ({ title, subtitle }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "clear" });
    setLoading(true);

    console.log(state);
  };

  return (
    <div className="min-h-screen flex">
      <LoginSection />
      <div
        className="flex flex-1 flex-col  px-16 md:px-24 xl:px-36 justify-center gap-8 lg:pb-28 order-first
      "
      >
        <Link to="/login" className="text-secondary flex gap-x-1">
          <ArrowLeft />
          <p>Back to portals</p>
        </Link>

        <div className="flex flex-col gap-12">
          <div className="space-y-3">
            <h2 className="text-4xl">{title}</h2>
            <p className="text-secondary text-xl">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-y-1">
              <label htmlFor="email" className="pl-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={state.email}
                placeholder="junbiao06@gmail.com"
                onChange={(e) =>
                  dispatch({ type: "setEmail", payload: e.target.value })
                }
                className="bg-primary rounded-md"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="email" className="pl-2">
                password
              </label>
              <div className="relative flex items-center ">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={state.password}
                  placeholder="••••••••"
                  onChange={(e) =>
                    dispatch({ type: "setPassword", payload: e.target.value })
                  }
                  className="bg-primary rounded-md"
                />
                <button
                  type="button"
                  className="absolute right-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="text-secondary" />
                  ) : (
                    <EyeIcon className="text-secondary" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-surface rounded-xl h-12 font-playwrite text-xl mt-8 cursor-pointer hover:bg-surface/90"
              disabled={loading}
            >
              {loading ? (
                <p className="flex justify-center items-center gap-3">
                  <div className="w-6 h-6 border-3 border-border border-t-primary rounded-full animate-spin" />
                  <p>Processing...</p>
                </p>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
