"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { WelcomeHeader } from "./components/WelcomeHeader";

export default function Login() {
  return (
    <main className="relative flex h-full min-h-screen bg-background p-12">
      <WelcomeHeader />

      <div className="flex w-full flex-col items-center justify-center">
        <Suspense fallback={<SkeletonLoader />}>
          <CapsuleContentWithFallback />
        </Suspense>
      </div>
    </main>
  );
}

const CapsuleContentWithFallback = dynamic(
  () => import("./components/CapsuleContent"),
  {
    ssr: false,
    loading: () => <SkeletonLoader />,
  },
);
