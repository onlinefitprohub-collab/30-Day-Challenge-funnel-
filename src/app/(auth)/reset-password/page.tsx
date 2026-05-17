import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Link from "next/link";

export const metadata = {
  title: "Reset Password | FitPro Launch",
};

export default function ResetPasswordPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mt-2 text-gray-500">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>
      <ResetPasswordForm />
      <p className="mt-6 text-center text-sm text-gray-500">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
