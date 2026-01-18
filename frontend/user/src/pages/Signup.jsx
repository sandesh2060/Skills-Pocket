// ============================================
// FILE: frontend/user/src/pages/Signup.jsx
// ============================================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";

// Rocket Icon Component
const RocketIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 13.12l2.23 2.23 1.88-1.88 1.62 1.62-1.88 1.88L8.08 19l.88-3.62c.31-.13 3.6-1.53 5.89-3.57 3.05-2.73 4.15-6.32 4.15-6.32s-3.59 1.1-6.32 4.15l-3.49-.29zM9 18l-4-4-.72 2.9L2 19.18l2.28 2.28 2.28-2.28L9 18zm4.42-13.56c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25-2.25-1.01-2.25-2.25 1.01-2.25 2.25-2.25z" />
  </svg>
);

// Eye Icons
const EyeIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "client", // Default to "I want to hire"
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError("Please enter your full name");
      return false;
    }
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms and Conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                "Registration successful! Please check your email to verify your account.",
              email: formData.email,
            },
          });
        }, 2000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Branding & Imagery */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
        style={{
          background: `linear-gradient(rgba(19, 127, 236, 0.2), rgba(16, 25, 34, 0.8)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 max-w-lg text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary">
              <RocketIcon />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              SkillsProcket
            </h1>
          </div>
          <h2 className="text-5xl font-black leading-tight mb-5">
            Empowering the world's best talent.
          </h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Join over 5 million professionals and businesses who use
            SkillsProcket to build high-performing teams and scale their
            careers.
          </p>
          <div className="mt-10 flex gap-8">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">12k+</span>
              <span className="text-sm opacity-70">Active Projects</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">98%</span>
              <span className="text-sm opacity-70">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden p-5 flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 text-primary">
            <RocketIcon />
          </div>
          <span className="text-xl font-bold">SkillsProcket</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-8">
          <div className="max-w-[480px] w-full mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-2xl font-bold text-[#0d141b]">
                  Create your account
                </h3>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Step 1 of 3
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/3 rounded-full"></div>
              </div>
            </div>

            {/* Role Toggle */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={formData.role === "client"}
                  onChange={handleChange}
                  className="peer hidden"
                />
                <div className="flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-primary text-slate-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <path d="M15.5 12c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.08 0-.15.01-.23.01.29.72.48 1.49.48 2.31 0 .82-.19 1.59-.48 2.31.08 0 .15.01.23.01zm4.5 4c0-1.5-2.5-2.5-4.5-2.5-.47 0-.95.07-1.43.16C15.32 14.42 16 15.5 16 17v3h4v-2z" />
                  </svg>
                  I want to hire
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="freelancer"
                  checked={formData.role === "freelancer"}
                  onChange={handleChange}
                  className="peer hidden"
                />
                <div className="flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-primary text-slate-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                  </svg>
                  I want to work
                </div>
              </label>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-sm">
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
              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-sm">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.08-.46-2.07-.48-3.2 0-1.44.62-2.2.45-3.04-.35C5.07 17.65 4.1 12.27 6.13 8.76c1.03-1.78 2.84-2.9 4.82-2.93 1.5-.03 2.53.86 3.44.86.9 0 2.23-1.04 4.02-.85 1.58.17 2.72.76 3.52 1.83-3.25 1.95-2.73 6.08.53 7.42-.76 1.9-1.78 3.73-3.37 5.19zM15.42 5.5c-.88 1.06-2.3 1.9-3.56 1.8-.16-1.25.4-2.63 1.25-3.64.9-.1 2.4-.9 3.53-1.93.1 1.25-.34 2.7-1.22 3.77z"></path>
                </svg>
                Apple
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Registration successful! Redirecting...
                </p>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jane"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <div className="w-5 h-5">
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </div>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Must be at least 8 characters long.
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 py-1">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-primary hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating account..."
                  : success
                  ? "Success!"
                  : "Create Account"}
              </button>
            </form>

            {/* Bottom Nav */}
            <div className="mt-6 text-center">
              <p className="text-slate-600 font-medium">
                Already have an account?
                <Link
                  to="/login"
                  className="text-primary font-bold hover:underline ml-1"
                >
                  Log in
                </Link>
              </p>
            </div>

            {/* Simple Footer Links */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center gap-6 text-xs text-slate-400 font-medium uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">
                Help Center
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
