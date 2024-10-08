import { Spinner } from "@/app/assets/spinner";

export default function Home() {
  return (
    <main className="flex h-full min-h-screen bg-background p-24">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="animate-spin">
          <Spinner />
        </div>
        <div className="mt-6 text-3xl font-semibold text-black">
          Creating your wallet
        </div>
      </div>
    </main>
  );
}
