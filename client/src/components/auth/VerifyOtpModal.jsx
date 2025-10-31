import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifyOtpModal({ open, onClose, onVerify, email }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!otp) return setError("Enter the OTP");
    setLoading(true);
    setError("");

    try {
      await onVerify(email, otp);
      onClose(); // close modal on success
    } catch (err) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Verify Your Email
          </DialogTitle>
          <p className="text-sm text-zinc-400 text-center mt-1">
            We've sent an OTP to <span className="text-zinc-200 font-medium">{email}</span>
          </p>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-3">
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="bg-zinc-800 border-zinc-700 text-center text-lg tracking-widest"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify OTP"}
          </Button>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-3">
          Didn’t get OTP? <span className="text-zinc-300 cursor-pointer hover:underline">Resend</span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
