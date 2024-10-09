import { Button } from "@/components/ui/button";
import { SelectToken } from "./SelectToken";
import { Icon, IconName } from "@/components/ui/icon";
import { useState } from "react";

export function Transact({
  handleSelect,
  swapTokens,
  hasError,
  updateTokenAmount,
}: {
  handleSelect: () => void;
  swapTokens: ISwapToken[];
  hasError: boolean;
  updateTokenAmount: (
    index: number,
    newAmount: number,
    newCoinAmount: number,
  ) => void;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="flex flex-col space-y-2">
        <div className="space-y-1">
          {swapTokens.map((token, idx) => (
            <div className="relative" key={idx}>
              {idx > 0 ? (
                <div className="absolute -top-4.5 left-1/2 flex h-[28px] w-[42px] -translate-x-1/2 transform items-center justify-center rounded-full bg-[#232323]">
                  <Icon name="data-transfer" className="text-white" />
                </div>
              ) : null}
              <SelectToken
                swapTokens={swapTokens}
                key={idx}
                token={token}
                from={idx === 0}
                updateTokenAmount={updateTokenAmount}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          ))}
        </div>
        {swapTokens.length < 2 ? (
          <Button
            onClick={handleSelect}
            className="flex h-[61px] !justify-start space-x-3 rounded-2xl bg-[#FFFFFF14] py-3.5 pl-4"
          >
            <div className="inline-flex size-7.5 items-center justify-center rounded-full bg-white/5">
              <Icon name="add" />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-xs text-white/40">Receive</p>
              <p className="text-base font-medium">Select token</p>
            </div>
          </Button>
        ) : null}
      </div>
      {hasError ? (
        <Button
          className={`mx-auto flex items-center ${SWAP_ALERT["warning"].style}`}
        >
          <Icon name={SWAP_ALERT["warning"].icon} />
          <p className="text-base font-medium">
            {SWAP_ALERT["warning"].description}
          </p>
        </Button>
      ) : (
        <Button
          onClick={handleSelect}
          size="lg"
          variant="plain"
          className="mt-1 min-h-[43px]"
        >
          Swap
        </Button>
      )}
    </>
  );
}

interface ISwapToken {
  amount: number;
  coin: string;
  balance: number;
  tag: string;
  coinAmount: number;
  tokenIcon: string;
}

const SWAP_ALERT = {
  error: {
    icon: "warning",
    description: "Insufficient funds",
    style: "text-[#F34D4D] bg-[#F34D4D0D]",
  },
  warning: {
    icon: "gas",
    description: "Insufficient Gas ~ $1.54 ETH",
    style: "text-[#D9DC37] bg-[#D9DC370D]",
  },
} as Record<
  "error" | "warning",
  { icon: IconName; description: string; style: string }
>;
