import { redirect } from "next/navigation";

export const metadata = {
  title: "Generating your funnel… | FitPro Launch",
};

// Generation is now handled inline by the wizard — this route is no longer used.
// Redirect to dashboard in case someone navigates here directly.
export default async function GeneratingPage() {
  redirect("/dashboard");
}
