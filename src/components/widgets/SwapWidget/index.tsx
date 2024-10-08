import { useState } from "react";
import { cn } from "@/utils/tailwind";
import { ISwapWidget } from "./types";
import { SelectSwapToken } from "./SelectSwap";
import { OrderConfirmation } from "./OrderConfirmation";
import { Confirmation } from "./Confirmation";
import { Transact } from "./Transact";

export function SwapWidgets() {
  const [step, setStep] = useState<
    "Transact" | "Select" | "Order Confirmation" | "Confirmation"
  >("Transact");
  const [swapTokens, setSwapTokens] = useState<ISwapWidget[]>([
    { amount: 100, coin: "ETH", balance: 175, tag: "ETH", coinAmount: 0.032 },
  ]);
  const handleAddToken = () => {
    setSwapTokens((prevSt) => [
      ...prevSt,
      { amount: 100, coin: "WIF", balance: 0, tag: "ETH", coinAmount: 10520 },
    ]);
    setStep("Transact");
  };
  return (
    <div
      className={cn(
        "flex aspect-square max-h-full flex-col justify-between overflow-hidden rounded-[20px] bg-black p-4 pb-0 font-sans",
        {
          "pb-4": step !== "Select",
        },
      )}
    >
      {step === "Transact" ? (
        <Transact
          hasError={false}
          handleSelect={() => {
            setStep(swapTokens.length > 1 ? "Order Confirmation" : "Select");
          }}
          swapTokens={swapTokens}
        />
      ) : null}
      {step === "Select" ? (
        <SelectSwapToken handleSelect={handleAddToken} />
      ) : null}
      {step === "Order Confirmation" ? (
        <OrderConfirmation
          handleContinue={() => {
            setStep("Confirmation");
          }}
          handleCancel={() => setStep("Transact")}
        />
      ) : null}
      {step === "Confirmation" ? (
        <Confirmation
          handleComplete={() => {
            setSwapTokens((prevSt) => (prevSt[0] ? [prevSt[0]] : prevSt));
            setStep("Transact");
          }}
        />
      ) : null}
    </div>
  );
}
