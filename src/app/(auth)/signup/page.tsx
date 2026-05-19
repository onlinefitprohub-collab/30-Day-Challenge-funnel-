import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export const metadata = {
  title: "Create your account | FitPro Launch",
};

interface Props {
  searchParams: Promise<{ plan?: string }>;
}

export default async function SignupPage({ searchParams }: Props) {
  const { plan } = await searchParams;
  const isPro = plan === "pro";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-gray-500">
          {isPro
            ? "One step away from your complete coaching business kit — $97/month, cancel any time."
            : "Launch your fitness coaching business in minutes."}
        </p>
      </div>
      <SignupForm redirectToCheckout={isPro} />
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
