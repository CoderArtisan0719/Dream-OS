import { useState } from "react";
import Image from "next/image";
import { ISwapWidget } from "./types";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/tailwind";

export function SelectToken({
  token: { amount, balance, coin, tag, coinAmount },
  from = false,
}: {
  token: ISwapWidget;
  from: boolean;
}) {
  const [slider, setSlider] = useState(10);
  return (
    <div
      className={cn(
        "rounded-[16px] border border-transparent bg-white/5 p-[14px] py-2 font-sans text-white",
        {
          "bg-[#FFFFFF14] !pb-1": !from,
          "!border-[#FFFFFF1A]": from,
        },
      )}
    >
      <p className="font-sans text-base text-white/40">
        {from ? "From" : "To"}
      </p>
      <div className="mb-1.5 flex justify-between">
        <span className="text-3xl font-semibold">
          <sup className="text-lg">$</sup>
          {amount}
        </span>
        <div className="flex cursor-pointer items-center space-x-2 rounded-[9px] bg-white/5 py-1.5 pl-2.25 pr-1 transition-all active:scale-90">
          <div className="relative">
            <div className="inline-flex items-center justify-center rounded-full bg-white p-1">
              <Icon name="ethereum" className="size-4.25" />
            </div>
            <Image
              alt="token"
              src="/images/stock/base.png"
              width={20}
              height={20}
              className="absolute -left-2 bottom-0"
            />
          </div>
          <p className="text-base">{coin}</p>
          <div className="inline-flex size-4 items-center justify-center text-white/60">
            <Icon name="arrow-right" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex space-x-1.5 text-xs">
          <p className="text-white/40">{`~ ${coinAmount} ${tag}`}</p>
          <Icon name="data-transfer" className="size-[14px] text-white/60" />
        </span>
        <div className="flex w-[95px] items-center justify-between text-xs font-medium">
          <p className="text-white/40">Bal</p>
          <p className="text-[#FFFFFF99]">{`${balance} ${tag}`}</p>
        </div>
      </div>
      {from ? (
        <div className="relative mt-2 flex h-[27px] items-center justify-center overflow-hidden rounded-[6px] bg-white/5">
          <div className="absolute flex h-full w-2/3 justify-around self-center py-[8px]">
            {["", "", ""].map((_, idx) => (
              <div key={idx} className="h-full w-[1px] bg-white/10" />
            ))}
          </div>
          <div
            className="absolute left-0 size-full rounded-[2px]"
            style={{
              background: `linear-gradient(270deg, #007AFF 0%, rgba(0, 122, 255, 0.51) 100%)`,
              width: `${slider - 0.1}%`,
            }}
          />
          <input
            type="range"
            min="0"
            max="100"
            defaultValue={slider}
            onChange={({ currentTarget: { value } }) => {
              setSlider(Number(value));
            }}
            className="slider relative z-10 size-full appearance-none bg-transparent focus:outline-none"
          />
          <span className="absolute right-2 text-xs font-semibold text-white">{`${slider}%`}</span>
        </div>
      ) : null}
    </div>
  );
}
