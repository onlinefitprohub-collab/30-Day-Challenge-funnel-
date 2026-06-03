"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

const signupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
  fullName: z.string().min(2, "Enter your name"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  redirectToCheckout?: boolean;
}

export function SignupForm({ redirectToCheckout = false }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true);
    try {
      const supabase = createClient();
      // Pass ?checkout=1 in the redirect URL so the callback can trigger checkout
      const next = redirectToCheckout ? "/dashboard?checkout=1" : "/dashboard";
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsSuccess(true);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="py-4 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
        <p className="mt-2 text-gray-500">
          We&apos;ve sent a confirmation link to <strong className="text-gray-700">your email address</strong>.
          Click it to activate your account
          {redirectToCheckout ? " and complete your subscription" : " and start building your funnel"}.
        </p>
        {redirectToCheckout && (
          <p className="mt-3 text-xs text-gray-400">
            After confirming your email you&apos;ll be taken directly to the payment page.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Email/password form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Your name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Sarah Jones"
            autoComplete="name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...register("password")}
          />
          <p className="text-xs text-gray-400">Min 8 characters · one uppercase letter · one number</p>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          variant="gradient"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : redirectToCheckout ? (
            <>
              Create account & subscribe
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-xs text-gray-400">
          By signing up, you agree to our{" "}
          <a href="/legal/terms" className="underline hover:text-gray-300">Terms of Service</a>
          {" "}and{" "}
          <a href="/legal/privacy" className="underline hover:text-gray-300">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
}
