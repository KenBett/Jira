// @\app\(auth)\sign-in\page.tsx
import { getCurrent } from "@/features/auth/queries";
import SignInCard from "@/features/auth/components/signInCard";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrent();

  if (user) redirect("/");
  return (
    <>
      <SignInCard />
    </>
  );
}
