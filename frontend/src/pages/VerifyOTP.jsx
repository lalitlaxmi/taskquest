import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiShieldCheckLine, RiRefreshLine } from "react-icons/ri";
import toast from "react-hot-toast";
import api from "../services/api";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // VERIFY OTP
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email.trim() || !otp.trim()) {
      return toast.error("Email and OTP are required");
    }

    setLoading(true);
    try {
      await api.post("/users/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });

      toast.success("OTP verified successfully 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResend = async () => {
    if (!email.trim()) {
      return toast.error("Enter email first");
    }

    setResending(true);
    try {
      await api.post("/users/resend-otp", {
        email: email.trim(),
      });

      toast.success("OTP resent to your email 📩");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0E1A]">
      {/* Glow background */}
      <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 mb-4">
            <RiShieldCheckLine className="text-3xl text-purple-400" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Verify <span className="text-purple-400">OTP</span>
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Enter the code sent to your email
          </p>
        </div>

        {/* Card */}
        <div className="card space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
              placeholder="you@example.com"
            />
          </div>

          {/* OTP */}
          <div>
            <label className="text-sm text-slate-400">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field mt-1 tracking-widest text-center text-lg"
              placeholder="123456"
              maxLength={6}
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <RiShieldCheckLine />
                Verify OTP
              </>
            )}
          </button>

          {/* Resend OTP */}
          <button
            onClick={handleResend}
            disabled={resending}
            className="btn-ghost w-full flex items-center justify-center gap-2"
          >
            <RiRefreshLine className={resending ? "animate-spin" : ""} />
            Resend OTP
          </button>

          {/* Back to login */}
          <p className="text-center text-sm text-slate-500">
            Back to{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-purple-400 cursor-pointer hover:text-purple-300"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}