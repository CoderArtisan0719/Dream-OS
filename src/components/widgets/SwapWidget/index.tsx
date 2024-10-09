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
    {
      amount: 0,
      coin: "ETH",
      balance: 3,
      tag: "ETH",
      coinAmount: 0,
      tokenIcon: "ethereum",
    },
  ]);

  const updateTokenAmount = (
    index: number,
    newAmount: number,
    newCoinAmount: number,
  ) => {
    setSwapTokens((prevTokens) => {
      const updatedTokens = [...prevTokens];
      updatedTokens[index] = {
        ...updatedTokens[index],
        amount: newAmount,
        coinAmount: newCoinAmount,
      };
      return updatedTokens;
    });
  };

  const handleAddToken = () => {
    setSwapTokens((prevSt) => [
      ...prevSt,
      {
        amount: 0,
        coin: "SOL",
        balance: 10,
        tag: "SOL",
        coinAmount: 0,
        tokenIcon: "solana",
      },
    ]);
    setStep("Transact");
  };

  return (
    <div
      className={cn(
        "overflow mx-auto flex aspect-square h-[370px] w-[320px] flex-col justify-between rounded-[20px] bg-black p-4 pb-0 font-sans md:float-left",
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
          updateTokenAmount={updateTokenAmount}
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
