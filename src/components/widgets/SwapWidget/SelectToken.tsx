import { useState, useRef } from "react";
import Image from "next/image";
import { ISwapWidget } from "./types";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/tailwind";
import getTokenOut from "@/app/api/v1/transaction/getTokenOut";

export function SelectToken({
  token: { amount, balance, coin, tag, coinAmount, tokenIcon },
  from = false,
  updateTokenAmount,
  swapTokens,
  loading,
  setLoading,
}: {
  swapTokens: Array<object>;
  token: ISwapWidget;
  from: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  updateTokenAmount: (
    index: number,
    newAmount: number,
    newCoinAmount: number,
  ) => void;
}) {
  const [toToken, setToToken] = useState({
    amount,
    balance,
    coin,
    tag,
    coinAmount: coinAmount.toString(),
    tokenIcon,
  });
  const [slider, setSlider] = useState(0);
  const [pendingValue, setPendingValue] = useState(slider);
  const [inputValue, setInputValue] = useState<string>(coinAmount.toString());
  const debounceTimeout = useRef<NodeJS.Timer | null>(null);

  const handleSliderChange = (value: number) => {
    setPendingValue(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      setSlider(value);
      if (value === 0) {
        setToToken({
          ...toToken,
          coinAmount: "0",
          amount: 0,
        });
        if (updateTokenAmount) {
          updateTokenAmount(1, 0, 0);
          updateTokenAmount(0, 0, 0);
        }

        return;
      }

      let temp = (toToken.balance * value) / 100;
      setInputValue(temp.toString());
      setLoading(true); // Start loading

      const { estimation } = await getTokenOut({
        chainId: "1",
        tokenIn: "0x0000000000000000000000000000000000000000",
        tokenInAmount: `${temp * 10 ** 18}`,
        tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      });

      const { tokenOut } = estimation;
      const tokenFrom = tokenOut;

      setToToken({
        ...toToken,
        coinAmount: temp.toString(),
        amount: Number((tokenOut.amount / 10 ** tokenOut.decimals).toFixed(3)),
      });

      setInputValue(temp.toString());

      if (!swapTokens[1]) {
        setLoading(false); // Stop loading
        updateTokenAmount(
          0,
          Number((tokenOut.amount / 10 ** tokenOut.decimals).toFixed(3)),
          temp,
        );
        return;
      }

      const { estimation: secondEstimation } = await getTokenOut({
        chainId: "7565164",
        tokenIn: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        tokenInAmount: `${tokenFrom.amount}`,
        tokenOut: "11111111111111111111111111111111",
      });

      const secondTokenOut = secondEstimation.tokenOut;
      setLoading(false); // Stop loading

      updateTokenAmount(
        0,
        Number((tokenOut.amount / 10 ** tokenOut.decimals).toFixed(3)),
        temp,
      );

      updateTokenAmount(
        1,
        Number((tokenFrom.amount / 10 ** tokenFrom.decimals).toFixed(3)),
        parseFloat(
          (secondTokenOut.amount / 10 ** secondTokenOut.decimals).toFixed(3),
        ),
      );
    }, 300);
  };

  const changeAmountInput = (inputValue: string) => {
    if (inputValue == "0.") {
      setSlider(0);
      setPendingValue(0);
      setInputValue("0");
    }
    const validInput = /^\d*\.?\d*$/.test(inputValue);
    if (!validInput) {
      return; // Ignore invalid input
    }

    const decimalPoints = (inputValue.match(/\./g) || []).length;
    if (decimalPoints > 1) {
      return; // Ignore input if more than one decimal point
    }

    let [integerPart, fractionalPart] = inputValue.split(".");

    if (integerPart === "") {
      integerPart = "0";
    } else {
      // Remove leading zeros from the integer part
      integerPart = integerPart.replace(/^0+(?!$)/, "");
      // If integerPart becomes empty after removing zeros, set it to '0'
      if (integerPart === "") {
        integerPart = "0";
      }
    }

    // Reconstruct the input value
    inputValue =
      fractionalPart !== undefined
        ? `${integerPart}.${fractionalPart}`
        : integerPart;

    setInputValue(inputValue); // Instant visual feedback

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (Number(inputValue) === 0) {
        updateTokenAmount(0, 0, 0);
        if (swapTokens[1]) updateTokenAmount(1, 0, 0);
        setSlider(0);
        return;
      }

      const floatRegex = /^-?\d*\.?\d*$/;
      if (!floatRegex.test(inputValue)) {
        return; // Invalid float input
      }

      const inputFloat = Number(inputValue);

      const newPendingValue = Number((inputFloat / 3).toFixed(3)) * 100;
      setPendingValue(newPendingValue);
      setSlider(newPendingValue);

      if (inputFloat > 3) return; // Limit input to a maximum of 3
      setLoading(true); // Start loading

      // First API call
      const { estimation } = await getTokenOut({
        chainId: "1",
        tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        tokenInAmount: `${inputFloat * 10 ** 18}`,
        tokenIn: "0x0000000000000000000000000000000000000000",
      });

      const { tokenOut } = estimation;
      const calculatedAmount = parseFloat(
        (tokenOut.amount / 10 ** tokenOut.decimals).toFixed(3),
      );

      // Update toToken state
      setToToken((prev) => ({
        ...prev,
        coinAmount: inputValue,
        amount: calculatedAmount,
      }));

      // Proceed with the second API call if necessary
      if (updateTokenAmount && swapTokens[1]) {
        const { estimation: secondEstimation } = await getTokenOut({
          chainId: "7565164",
          tokenIn: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          tokenInAmount: `${tokenOut.amount}`,
          tokenOut: "11111111111111111111111111111111",
        });
        setLoading(false); // Stop loading

        const secondTokenOut = secondEstimation.tokenOut;
        updateTokenAmount(0, calculatedAmount, inputFloat);
        updateTokenAmount(
          1,
          calculatedAmount,
          parseFloat(
            (secondTokenOut.amount / 10 ** secondTokenOut.decimals).toFixed(3),
          ),
        );
        console.log("secondtokenout", secondTokenOut);
      } else {
      }
    }, 300);
  };

  return (
    <div
      className={cn(
        "rounded-[16px] border border-transparent bg-white/5 p-[14px] pt-[9px] font-sans text-white",
        {
          "bg-[#FFFFFF14] !pb-[9px]": !from,
          "!border-[#FFFFFF1A]": from,
        },
      )}
    >
      <p className="font-sans text-base text-white/40">
        {from ? "From" : "To"}
      </p>
      <div className="mb-2.5 mt-2.25 flex justify-between">
        <span className="flex flex-row text-3xl font-semibold">
          <span className="invisible absolute" id="amount-span">
            {inputValue || "0"}
          </span>
          {loading && !from ? (
            <div
              className="skeleton-loader"
              style={{ width: "50px", height: "1em" }}
            ></div>
          ) : (
            <input
              value={from ? inputValue : coinAmount}
              type="text"
              onChange={(e) => {
                changeAmountInput(e.target.value);
              }}
              className="px-0 py-0 text-3xl focus:outline-none"
              style={{
                width: "120px",
                background: "none",
                border: "none",
              }}
              placeholder="0"
              disabled={!from}
            />
          )}
        </span>
        <div className="flex h-[37px] cursor-pointer items-center space-x-2 rounded-[9px] bg-white/5 py-1.5 pl-2.25 pr-1 transition-all active:scale-90">
          <div className="relative">
            <div className="inline-flex items-center justify-center rounded-full bg-white p-1">
              <Icon name={toToken.tokenIcon} className="size-4.25" />
            </div>
            <Image
              alt="token"
              src="/images/stock/base.png"
              width={20}
              height={20}
              className="absolute -left-2 bottom-0"
            />
          </div>
          <p className="text-base">{toToken.coin}</p>
          <div className="inline-flex size-4 items-center justify-center text-white/60">
            <Icon name="arrow-right" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex space-x-1.5 text-xs">
          {loading ? (
            <div
              className="skeleton-loader"
              style={{ width: "50px", height: "1em" }}
            ></div>
          ) : (
            <p className="text-white/40">{`~ ${new Intl.NumberFormat().format(amount)} $`}</p>
          )}
          <Icon name="data-transfer" className="size-[14px] text-white/60" />
        </span>
        <div className="flex w-[95px] items-center justify-between text-xs font-medium">
          <p className="text-white/40">Bal</p>
          <p className="text-[#FFFFFF99]">{`${toToken.balance} ${tag}`}</p>
        </div>
      </div>
      {from ? (
        <div className="relative mt-[17px] flex h-[25px] items-center justify-center overflow-hidden rounded-[6px] bg-white/5">
          <div className="absolute flex h-full w-2/3 justify-around self-center py-[8.5px]">
            {["", "", ""].map((_, idx) => (
              <div key={idx} className="h-full w-[1px] bg-white/10" />
            ))}
          </div>
          <div
            className="absolute left-0 size-full rounded-[2px]"
            style={{
              background: `linear-gradient(270deg, #007AFF 0%, rgba(0, 122, 255, 0.51) 100%)`,
              width: `${slider === 0 ? slider : slider - 0.1}%`,
            }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={pendingValue}
            onChange={({ currentTarget }) =>
              handleSliderChange(parseFloat(currentTarget.value))
            }
            className="slider relative z-10 size-full appearance-none bg-transparent focus:outline-none"
          />
          <span className="absolute right-2 text-xs font-semibold text-white">{`${slider}%`}</span>
        </div>
      ) : null}
    </div>
  );
}
