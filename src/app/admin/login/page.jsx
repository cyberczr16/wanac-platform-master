"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleValidationErrors } from "@/lib/error";
import { BASE_URL } from "@/services/api/config";
import { extractAuthToken, extractAuthUser } from "@/lib/authResponse.utils";

const AUTH_API_BASE = BASE_URL;

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);

      try {
        const response = await fetch(`${AUTH_API_BASE}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            role: "admin",
            social: false,
          }),
        });

        let data;
        try {
          data = await response.json();
        } catch {
          toast.error("Login failed: invalid response from server.");
          return;
        }

        if (!response.ok) {
          if (data?.errors) {
            handleValidationErrors(data.errors);
          } else if (data?.error) {
            toast.error(data.error);
          } else {
            toast.error("Login failed");
          }
          return;
        }

        const token = extractAuthToken(data);
        if (!token) {
          toast.error("Login succeeded but no token was returned. Please try again.");
          return;
        }

        const apiUser = extractAuthUser(data);
        const role = String(apiUser?.role ?? "admin").toLowerCase();

        if (role !== "admin") {
          toast.error("Access denied. This login is for administrators only.");
          return;
        }

        localStorage.setItem(
          "wanacUser",
          JSON.stringify({ ...(apiUser ?? {}), userType: role })
        );
        localStorage.setItem("auth_token", token);
        toast.success(data.message ?? "Signed in successfully.");
        router.push("/admin");
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen h-screen flex overflow-hidden">
      {/* Left Side - Admin Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 flex-col justify-center relative overflow-hidden">
        <div className="relative z-10">
          <img
            src="/WANAC-logo-white-orange.svg"
            alt="WANAC Logo"
            className="h-12 mb-8 w-auto"
          />
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            WANAC Administration
          </h1>
          <p className="text-white text-base leading-relaxed opacity-90 max-w-lg">
            Manage the platform, monitor activity, and support coaches and
            clients across the WANAC ecosystem.
          </p>
        </div>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>

      {/* Right Side - Admin Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <img
              src="/WANAC N 8 Old Glory.png"
              alt="WANAC Logo"
              className="h-10 mb-4 lg:hidden"
            />
            <div className="inline-block px-2.5 py-1 bg-brand-navy text-white text-xs font-semibold rounded mb-3 uppercase tracking-wide">
              Admin Portal
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-1">
              Administrator Sign In
            </h2>
            <p className="text-gray-600 text-sm">
              Authorized personnel only
            </p>
          </div>

          {errors.submit && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-500 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-navy mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@wanac.org"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-brand-orange focus:border-brand-orange"
                }`}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-navy mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-brand-orange focus:border-brand-orange"
                  } pr-10`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-brand-orange"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Back to regular login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Not an admin?{" "}
            <a
              href="/login"
              className="text-brand-orange hover:underline font-medium"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
