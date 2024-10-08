import { LogoBevel } from "@/app/assets/logoBevel";
import { ClaimUniqueHeader } from "@/app/claim/components/ClaimUniqueHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Login() {
  return (
    <main className="relative flex h-full min-h-screen bg-background p-12">
      <ClaimUniqueHeader />

      <div className="mx-auto flex w-full max-w-96 flex-col items-center justify-center">
        <div className="flex h-56 w-96 items-center justify-center rounded-2xl border border-black/10 bg-gradient-to-b from-[#e5e5e5] to-[#cccccc] shadow">
          <LogoBevel />
        </div>
        <div className="mt-8 max-w-80 text-center text-md font-normal leading-normal text-black">
          Explain some DreamID Key features to users, and let them know.
        </div>

        <div className="mt-20 flex w-full flex-row justify-between space-x-4">
          <Button
            size="lg"
            variant="secondary"
            className="flex-1 text-base font-normal"
            asChild
          >
            <Link href="/desktop">Maybe Later</Link>
          </Button>
          <Button size="lg" className="flex-1 text-base font-normal" asChild>
            <Link href="/claim/choose">Claim Now</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
