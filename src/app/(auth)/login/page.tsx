import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export const metadata = {
  title: "Log in | FitPro Launch",
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-gray-500">
          Log in to access your funnel projects
        </p>
      </div>
      <LoginForm />
      <div className="mt-6 flex flex-col items-center gap-2 text-sm text-gray-500">
        <Link
          href="/reset-password"
          className="font-medium text-gray-400 hover:text-brand-600 transition-colors"
        >
          Forgot your password?
        </Link>
        <span>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Sign up free
          </Link>
        </span>
      </div>
    </div>
  );
}
