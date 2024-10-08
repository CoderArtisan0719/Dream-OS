"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DreamLogo } from "./assets/logo";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    console.log("click click click");
    setIsLoading(true);
    router.push("/login");
  };

  return (
    <main className="flex h-full min-h-screen bg-background p-24">
      <div className="flex w-full flex-col items-center justify-center">
        <button
          onClick={handleClick}
          className={`inline-flex h-28 w-28 items-center justify-center rounded-3xl bg-white p-7 transition-transform duration-300 hover:scale-105 ${
            isLoading ? "scale-95 opacity-75" : ""
          }`}
          disabled={isLoading}
        >
          <DreamLogo />
        </button>
      </div>
    </main>
  );
}
