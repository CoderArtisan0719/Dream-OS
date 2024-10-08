import { ClaimUniqueHeader } from "@/app/claim/components/ClaimUniqueHeader";
import { ClaimCard } from "../components/ClaimCard";

export default function Login() {
  return (
    <main className="relative flex h-full min-h-screen flex-col justify-center bg-background p-12">
      <ClaimUniqueHeader />

      <ClaimCard />
    </main>
  );
}
