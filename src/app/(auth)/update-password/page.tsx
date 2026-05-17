import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata = {
  title: "Set New Password | FitPro Launch",
};

export default function UpdatePasswordPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
        <p className="mt-2 text-gray-500">
          Choose a strong password for your account
        </p>
      </div>
      <UpdatePasswordForm />
    </div>
  );
}
