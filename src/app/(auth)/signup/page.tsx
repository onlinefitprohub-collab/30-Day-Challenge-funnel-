import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export const metadata = {
  title: "Sign up | FitPro Launch",
};

export default function SignupPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Start your FitPro Launch account
        </h1>
        <p className="mt-2 text-gray-500">
          Generate 20+ assets and launch your first paid challenge this week
        </p>
      </div>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
