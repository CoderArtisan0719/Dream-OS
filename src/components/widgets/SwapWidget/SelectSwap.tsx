import getTokens from "@/app/api/v1/transaction/getTokens";
import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/ui/icon";
import { formatAmount } from "@/utils";
import { cn } from "@/utils/tailwind";
import { useEffect, useState } from "react";
import { TokenOption } from "./types";
import Image from "next/image";

export function SelectSwapToken({
  handleSelect,
}: {
  handleSelect: () => void;
}) {
  const [tokenList, setTokenList] = useState<TokenOption[]>([]);
  const [selectedToken, setSelectedToken] = useState<
    (typeof TOKEN_OPTIONS)[number]
  >({ label: "Ethereum" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function func() {
      const chainId =
        selectedToken.label === "Ethereum"
          ? 1
          : selectedToken.label === "Solana"
            ? 7565164
            : 8453;

      const temp = await getTokens({ chainId });
      const tokensArray = Object.values(temp.tokens) as TokenOption[];
      setTokenList(tokensArray);
    }
    func();
  }, [selectedToken]);

  function isValidUrl(uri: string | URL): boolean {
    try {
      const url = new URL(uri);
      return true;
    } catch (err) {
      return false;
    }
  }

  const changeUrl = (uri: string): string => {
    const cleanedUrl = uri.trim();

    if (cleanedUrl.startsWith("ipfs://")) {
      const cid = cleanedUrl.replace("ipfs://", "");
      return `https://dweb.link/ipfs/${cid}`;
    }

    return encodeURI(cleanedUrl);
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-[42px] w-full items-center space-x-2 rounded-[12px] bg-white/5 px-2.5 pl-[11px] text-white/40">
        <Icon name="search" className="size-5" />
        <input
          type="text"
          placeholder="Search Tokens"
          value={search}
          onChange={({ currentTarget: { value } }) => {
            setSearch(value);
          }}
          className="w-full bg-transparent pr-3 outline-none placeholder:text-base"
        />
      </div>
      <div className="mb-[13px] mt-4 flex h-fit w-full space-x-2 overflow-auto">
        {TOKEN_OPTIONS.map(({ label, icon }, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedToken({ label, icon })}
            className={cn(
              "inset-0 flex h-[30px] cursor-pointer items-center justify-center space-x-1.5 rounded-[6px] bg-[#F2F2F21A] px-[9px] py-2.5 text-[#FFFFFF66] transition-all active:scale-90",
              {
                "bg-[#F2F2F21A] text-white shadow-token":
                  selectedToken?.label === label,
              },
            )}
          >
            {icon?.length ? (
              <Icon name={icon} className="size-[20px] rounded-full" />
            ) : null}
            <p className="text-sm">{label}</p>
          </div>
        ))}
      </div>
      <div className="h-full overflow-hidden">
        <div className="mb-[15px] flex items-center space-x-1.5 font-medium text-[#FFB200]">
          <Icon name="star-filled" />
          <p className="text-base">Your Favorites</p>
        </div>
        <div className="h-full space-y-3.5 overflow-auto px-0">
          {tokenList.map(
            ({ logoURI, name, amount = 3, rate = 3, symbol }, idx) => (
              <Button
                onClick={handleSelect}
                className="flex w-full justify-between bg-transparent !p-0"
                key={idx}
              >
                <div className="flex space-x-4">
                  <div className="relative inline-flex size-10 items-center justify-center rounded-full bg-white">
                    <Image
                      src={
                        isValidUrl(logoURI)
                          ? changeUrl(logoURI)
                          : "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
                      }
                      width={30}
                      height={30}
                      alt={name}
                    />
                    {selectedToken?.icon ? (
                      <div className="absolute -right-0.5 bottom-0 size-4">
                        <Icon name={selectedToken.icon} />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-start font-medium">
                    <p className="text-[17px]">{name}</p>
                    <p className="text-white/60">{symbol}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end font-medium">
                  <p className="font-[17px]">
                    {formatAmount(amount, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[#34C759]">{`+${rate}%`}</p>
                </div>
              </Button>
            ),
          )}
          <div className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}

const TOKEN_OPTIONS: { icon?: IconName; label: string }[] = [
  {
    label: "All",
  },
  {
    label: "Ethereum",
    icon: "ethereum-blue",
  },
  {
    label: "Base",
    icon: "base",
  },
  {
    label: "Solana",
    icon: "solana-black",
  },
];

const ETHEREUM = {
  tokenIcon: "ethereum",
  network: "ethereum-blue",
  token: "Ethereum",
  tag: "ETH",
  amount: 3.2,
  rate: 10.93,
};

const SOLANA = {
  tokenIcon: "solana",
  network: "solana-blue",
  token: "Solana",
  tag: "SOL",
  amount: 146.04,
  rate: 2.18,
};
