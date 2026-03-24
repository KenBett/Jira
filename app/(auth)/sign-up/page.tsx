// @\app\(auth)\sign-up\page.tsx
import SignUpCard from "@/features/auth/components/signUpCard";
import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrent();
  if (user) redirect("/");
  return (
    <>
      <SignUpCard />
    </>
  );
}
