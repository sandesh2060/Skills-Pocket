//File : frontend/user/src/pages/Login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================
// SVG ICONS
// ============================================
const RocketIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 13.12l2.23 2.23 1.88-1.88 1.62 1.62-1.88 1.88L8.08 19l.88-3.62c.31-.13 3.6-1.53 5.89-3.57 3.05-2.73 4.15-6.32 4.15-6.32s-3.59 1.1-6.32 4.15l-3.49-.29zM9 18l-4-4-.72 2.9L2 19.18l2.28 2.28 2.28-2.28L9 18zm4.42-13.56c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25-2.25-1.01-2.25-2.25 1.01-2.25 2.25-2.25z" />
  </svg>
);

const QuoteIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </svg>
);

// ============================================
// THEME TOGGLE COMPONENT
// ============================================
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-slate-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

// ============================================
// MAIN LOGIN COMPONENT
// ============================================
export default function UnifiedLogin() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ IMPORTANT: Import login from AuthContext

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Detect if email is an admin email
  const isAdminEmail = (email) => {
    return (
      email.endsWith("@admin.skillspocket.com") ||
      email.endsWith("@skillspocket.com")
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };
  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, password } = formData;

      // First, always try the user API (port 5000)
      let response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = await response.json();

      console.log("📊 User API Response:", { success: response.ok, data });

      if (!response.ok) {
        // If user API failed, try admin API
        console.log("⚠️ User API failed, trying Admin API...");
        response = await fetch("http://localhost:5001/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        data = await response.json();
        console.log("📊 Admin API Response:", { success: response.ok, data });

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
      }

      if (data.success) {
        const token = data.data.token;
        const userData = data.data.admin || data.data.user;
        const isAdminUser = !!data.data.admin || userData?.role === "admin";

        console.log("✅ Login successful!");
        console.log("👤 User Data:", userData);
        console.log("🔑 Is Admin:", isAdminUser);
        console.log("📦 Token:", token.substring(0, 20) + "...");
        console.log("📦 Full User Object:", JSON.stringify(userData, null, 2));

        if (isAdminUser) {
          // Admin login - redirect to admin dashboard
          localStorage.setItem("adminToken", token);
          localStorage.setItem("adminData", JSON.stringify(userData));

          // Create redirect URL with params
          const adminData = btoa(JSON.stringify(userData));
          const redirectUrl = `http://localhost:5174/dashboard?token=${encodeURIComponent(token)}&admin=${encodeURIComponent(adminData)}`;

          console.log("🚀 REDIRECTING TO ADMIN DASHBOARD");
          console.log("🔗 Full URL:", redirectUrl);

          // Small delay to see the logs
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 500);
        } else {
          // ✅ FIXED: Use AuthContext login method instead of direct localStorage
          console.log("👤 Using AuthContext login method");
          login(token, userData, "user");

          console.log("👤 Redirecting to user dashboard:", userData.role);

          // Navigate after a tiny delay to ensure state is updated
          setTimeout(() => {
            if (userData.role === "freelancer") {
              navigate("/freelancer/dashboard", { replace: true });
            } else if (userData.role === "client") {
              navigate("/client/dashboard", { replace: true });
            }
          }, 100);
        }
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Show admin indicator if email matches admin pattern OR if we detect admin role
  const showAdminBadge =
    formData.email &&
    (isAdminEmail(formData.email) ||
      formData.email === "sharmsandes121@gmail.com");

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Side - Background Image with Quote */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-end p-20"
        style={{
          backgroundImage: `linear-gradient(rgba(19, 127, 236, 0.1), rgba(16, 25, 34, 0.7)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDMtER3pIi4G3JZaUSxm9aKw-nFsvCEHgeAW2d6BIpbg60ekutPHF6lwiuSm0dJXSDc2gAK1kzXbxPWfVCY6l9qjnCXWqjp_BBJCW9PtQIeVBm-K8oRJ__O1dsey4rN3HDGaJAh6ojm1GsJtUb1Q42WKdMPqKSyL4wuC7Z6UoC2kz-1K_3Mss1hwhb27v6uYjA10UcDPzo1td9flgnEenUrflQ4MJbyDdmu_CPxQf_-IhyYTxyXNrkIbc1k6A7arPSqC7mzD4rZgI6k)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-blue-600 shadow-lg">
            <RocketIcon />
          </div>
          <span className="text-white text-2xl font-extrabold tracking-tight">
            SkillsPocket
          </span>
        </div>

        <div className="relative z-10 max-w-xl">
          <div
            className="p-10 rounded-2xl text-white"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <div className="w-12 h-12 mb-6 opacity-80">
              <QuoteIcon />
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-6">
              "Your talent determines what you can do. Your motivation
              determines how much you are willing to do."
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-blue-600"></div>
              <p className="text-lg font-medium opacity-90 tracking-wide uppercase">
                Professional Excellence
              </p>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-6 text-white/80">
            <div className="flex -space-x-3">
              <img
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA8zPWG9LuurjS-5AsYC18vjECP2zpiUKtbw7QwkvX-0n7liaKqMJ7CxhnJOmx7X3k5yzsX-FNXJeFxZONa-ki7LlxD3zBtqpXZvjAnTroAtEf_Ig_uML1WYyAiGWvocF-0CD2hXRpdsxvSIc8GLV1McKZoNklxl9TlnFG_NzZUFTY8wK8Hy3HrBHdn6IGg1b75FBoKBfq-Jn9kO07sxjvIpa2n9RoGu1EkPDI2kTk5eL0KDWWuu-i7wiAwhP8F2q5oGhnmNBuliE2"
              />
              <img
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ2CxBF5uLOwp7BZ482rigPtYQF_omsn-iERmFdsQycotxVNRyIF4NrqtnHNfV5uGe4DeKDm_KKiuSlwUPBOC9UdOEzFwhiodgZpFXNxVV-0YBZTsuqoU-SXPPXMyUukqTDrDOwGnagoHIsNJWhgre5o_0Ao8ZloFHBqocA2BFH289d9nLl9s-hxkDbQDI4M77DV4Ox_GpF1S4BTLE97Ho_-GXw6wq59x57UF19SzUAiqTtp_MspqSHXX5WWnCgU2qb4-4OMGoK6df"
              />
              <img
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfJyXm_Tt8xJj4m2pJ-Izf4OBkalbS0JAbTDJq0tD9I6a7p-0qtGvmT2vgRiGeG2-dlLx5HDEz-SQuAQRIDo5MZhF1edsjT8ZNenCfhwPz-yGSaaRVi-1Im2m0Zi5NQrDBLyISoUJ759UKr4yiHR3EbN_1B0g_iPGizAjCTqRgzpFp8dBpizEj4JX6gXrWyf4Fv_6EnH7G31NIkrtA7lSvI8c056r0mumeLnFEQsbz4GLDLeoBxLJceCTqTzwe5Fnm0NsHynRdb8Xr"
              />
              <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white/20 flex items-center justify-center text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm font-medium">Join 50k+ experts online now</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto">
        <div className="lg:hidden p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 text-blue-600">
              <RocketIcon />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              SkillsPocket
            </span>
          </div>
          <Link to="/signup" className="text-sm font-semibold text-blue-600">
            Sign Up
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-16">
          <div className="max-w-[440px] w-full mx-auto">
            <div className="mb-10">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                Welcome Back
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Please enter your details to sign in to your account.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {showAdminBadge && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
                <ShieldIcon />
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
                  Admin Login Detected
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <div className="w-5 h-5">
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center px-1">
                <input
                  type="checkbox"
                  id="remember"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Keep me logged in
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-bold tracking-widest">
                  Or login with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-sm text-slate-700 dark:text-slate-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-sm text-slate-700 dark:text-slate-300">
                <svg
                  className="w-5 h-5 text-[#0077b5]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
                LinkedIn
              </button>
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Don't have an account yet?
                <Link
                  to="/signup"
                  className="text-blue-600 font-bold hover:underline ml-1"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-8 text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
