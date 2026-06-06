import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CheckSquare,
  Lock,
  Mail,
  User,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import userStore from "../store/user";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const { signIn, register } = userStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signIn({ email, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await register({ name, email, password, confirmPassword });
      setMode("login");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "h-11 pl-9 pr-10";
  const primaryButtonClass =
    "inline-flex h-11 w-full items-center justify-center rounded-xl border-0 gradient-primary font-semibold text-white transition hover:opacity-90";

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 gradient-hero p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Taskify</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Organize your work,
            <br />
            <span className="text-white/70">amplify your focus.</span>
          </h2>

          <ul className="space-y-3 text-sm text-white/80">
            {[
              "Create and manage tasks with categories",
              "Set due dates with smart reminders",
              "Search and filter across all your tasks",
              "Your data synced across devices",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/40 text-xs">
          Copyright {new Date().getFullYear()} Taskify. Powered by Codecraze.
        </p>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Taskify</span>
          </div>

          <div className="flex rounded-xl bg-muted p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-white shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setMode("register-email")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "register-email"
                  ? "bg-white shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in to your Taskify account
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className={primaryButtonClass}>
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Sign In
              </button>
            </form>
          )}

          {mode === "register-email" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Create your account
                </h1>

                <div className="mt-4 p-4 bg-[hsl(243,75%,97%)] rounded-2xl border border-[hsl(243,75%,90%)]">
                  <h3 className="text-xs font-semibold text-[hsl(243,75%,45%)] uppercase tracking-wide mb-2">
                    Why create an account?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create an account to save your tasks, set reminders, and
                    access them from any device.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="register-name"
                    className="text-sm font-medium"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="register-email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="register-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="register-confirmation"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-confirmation"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className={primaryButtonClass}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
