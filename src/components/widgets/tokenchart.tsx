import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  getTokenData,
  getTokenInfo,
  getBalanceAndVolume,
  getTrendColor,
  getPreviousTime,
} from "./utils";
import { Text } from "@/components/ui/Text";
import { useContainerMediaQuery } from "@/utils/hooks/useContainerMediaQuery";
import { cn } from "@/utils/tailwind";
import { formatAmount, formatDate, formatTime, getFillGradient } from "@/utils";
import { AnimateNumber } from "../ui/AnimateNumber";
import { Button } from "../ui/button";
import { Icon, IconName } from "../ui/icon";
import { LineChart } from "../charts/Linechart";
import {
  IOverview,
  ITokenInfo,
  ITokenList,
} from "@/app/api/v1/[[...slugs]]/models/tokens";
import { getApi } from "@/utils/getApi";

export interface TokenChartProps {
  token: string;
  variant?: "default" | "stacked";
}

interface ISelectedToken {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  address: string;
}

export function TokenCharts({
  variant = "default",
  token: paramsToken,
}: TokenChartProps) {
  const currency: "usd" = "usd";
  const { api } = getApi();

  const [tokenInfo, setTokenInfo] = useState<ITokenInfo>();
  const [supportedChain, setSupportedChain] = useState<string[]>([]);
  const [tokenList, setTokenList] = useState<ITokenList>([]);
  const [tokenOverview, setTokenOverview] = useState<IOverview>();
  const [loadingHistoricalData, setLoadingHistoricalData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DurationType>("1h");
  const [selectedToken, setSelectedToken] = useState<ISelectedToken>();
  const { matches: isMediumSize, containerRef } = useContainerMediaQuery(361);
  const [dataByTime, setDataByTime] =
    useState<Record<DurationType, number[][]>>(DEFAULT_DATA_BY_TIME);

  const trend = useMemo(
    () =>
      tokenInfo?.marketData.priceChangePercentage24hInCurrency[currency] || 0,
    [tokenInfo],
  );

  const lineChartData = useMemo(
    () => ({
      data: dataByTime[selectedDate].map((datum) => datum[1]) || [],
      formattedLabel: dataByTime[selectedDate].map((time) =>
        selectedDate === "1h" || selectedDate === "1d"
          ? formatTime(new Date(time[0]))
          : formatDate(time[0]),
      ),
    }),
    [dataByTime, selectedDate],
  );

  const {
    socialLinks,
    tokenData,
    getBalance,
    tokenInfo: tokenInfoData,
  } = useMemo(() => {
    const { SocialLinks, ...others } = getTokenInfo({
      currency,
      tokenInfo,
      tokenOverview,
    });
    return {
      tokenInfo: others,
      socialLinks: SocialLinks,
      tokenData: getTokenData({
        currency,
        tokenOverview,
        tokenInfo,
      }),
      getBalance: getBalanceAndVolume(tokenInfo),
    };
  }, [tokenInfo, tokenOverview]);

  const getTokenInfoReq = async () => {
    setLoading(true);
    try {
      const { data, error } = await api.v1.tokens
        .info({ id: paramsToken })
        .get({ query: { baseCurrency: "usd" } });
      if (!data) return;
      setTokenInfo(data);
    } finally {
      setLoading(false);
    }
  };

  const getTokenOverviewReq = async (address: string, chain: string) => {
    setLoading(true);
    try {
      const { data, error } = await api.v1.tokens
        .overview({ address })
        .get({ query: { chain } });
      if (!data) return;
      setTokenOverview(data);
    } finally {
      setLoading(false);
    }
  };

  const getTokenTrend = async (token: string) => {
    setLoadingHistoricalData(true);
    const dateParams = DATE_OPTIONS.map((item) => ({
      label: item.value,
      promise: api.v1.tokens.trend({ id: token }).get({
        query: { baseCurrency: currency, ...getPreviousTime(item.value) },
      }),
    }));

    Promise.allSettled(
      dateParams.map(({ label, promise }) =>
        promise.then(
          (value) => ({ label, value }), // Fulfilled case
        ),
      ),
    )
      .then((result) =>
        result
          .filter((item) => item.status === "fulfilled")
          .reduce(
            (acc, { value }) => {
              acc[value.label] = value.value.data?.prices || [];
              return acc;
            },
            {} as Record<DurationType, number[][]>,
          ),
      )
      .then((response) => {
        setDataByTime(response);
      })
      .finally(() => {
        setLoadingHistoricalData(false);
      });
  };

  const getTokenList = async () => {
    const { data } = await api.v1.tokens.list.get();
    if (!data) return;
    setTokenList(data);
  };

  const getSupportedNetwork = async () => {
    const { data } = await api.v1.tokens.networks.get();
    if (!data) return;
    setSupportedChain(data);
  };

  // Get all the token list, will need the chain and the address
  useEffect(() => {
    getTokenList();
    getSupportedNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!paramsToken || !currency || !tokenList.length) return;
    getTokenInfoReq();
    getTokenTrend(paramsToken);
    const foundNetwork = tokenList.find((item) => item.id === paramsToken);
    if (foundNetwork) {
      const { platforms, ...network } = foundNetwork;
      let address = "",
        chain = "";
      const supported = Object.keys(platforms).filter((chain) =>
        supportedChain.includes(chain),
      );
      if (supported.length) {
        chain = supported[0];
        address = platforms[supported[0]];
      }
      setSelectedToken({
        id: network.id,
        name: network.name,
        symbol: network.symbol,
        address,
        chain,
      });
    }
  }, [paramsToken, currency, JSON.stringify(tokenList)]);

  useEffect(() => {
    if (!selectedToken?.address || !selectedToken.chain) return;
    getTokenOverviewReq(selectedToken.address, selectedToken.chain);
  }, [JSON.stringify(selectedToken)]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "aspect-square size-full h-[370px] w-[320px] snap-y snap-mandatory overflow-auto rounded-[20px] bg-black p-3.75 font-sans font-semibold text-white",
        {
          "max-h-[172px]": variant === "default",
        },
      )}
    >
      <div className="mb-4 grid h-full snap-center grid-cols-1 @[361px]:grid-cols-2 @[361px]:gap-x-[21px] @[361px]:gap-y-[27px]">
        <div
          className={cn("flex w-full space-x-2", {
            "font-geist": variant === "stacked",
          })}
        >
          <div
            className={cn(
              "size-7.5 overflow-hidden rounded-full transition-all",
              {
                "animate-pulse bg-[#1D1D1D]": loading,
                "bg-[#1D1D1D]": !tokenInfo?.image.thumb,
              },
            )}
          >
            {!loading && tokenInfo?.image.thumb ? (
              <Image
                alt="token"
                src={tokenInfo?.image.thumb}
                width={30}
                height={30}
                style={{ objectFit: "contain" }}
              />
            ) : null}
          </div>
          <div className="w-2/3 overflow-hidden">
            <Text
              isLoading={loading}
              skeletonSize="lg"
              className="whitespace-nowrap text-sm text-white @[361px]:text-xl @[361px]:!leading-[20px]"
            >
              {tokenInfo?.name}
            </Text>
            <Text
              isLoading={loading}
              className="text-xs leading-[14.32px] text-[#FFFFFF99] @[361px]:text-sm"
            >
              {tokenInfo?.symbol.toLocaleUpperCase()}
            </Text>
          </div>
        </div>
        <div
          className={cn(
            "hidden w-full flex-col space-y-2 text-xxxs font-semibold leading-[11.93px] @[361px]:flex",
            {
              "!hidden": variant === "stacked",
            },
          )}
        >
          {tokenData.map(({ info, label }, idx) => (
            <div
              key={idx}
              className="flex w-full items-center justify-between space-x-[65px]"
            >
              <Text
                isLoading={loading}
                className="whitespace-nowrap text-[#FFFFFF66]"
              >
                {label}
              </Text>
              <Text
                isLoading={loading}
                skeletonSize="sm"
                className="text-white"
              >
                {info}
              </Text>
            </div>
          ))}
        </div>
        <div
          className={cn({
            "col-span-1 max-h-[44px]": variant !== "stacked",
            "col-span-2 max-h-[103px]": variant === "stacked",
          })}
        >
          <LineChart
            data={lineChartData.data}
            isLoading={loadingHistoricalData}
            getFillGradientProp={() =>
              getFillGradient("#FFFFFF33", "#FFFFFF00")
            }
            lineColor={
              loadingHistoricalData || lineChartData.data.length === 0
                ? "#1D1D1D"
                : "#FFFFFF"
            }
            borderWidth={2}
            pointColor="#FFF"
            pointRadius={(ctx, _) => {
              return isMediumSize &&
                variant === "stacked" &&
                ctx.dataIndex === lineChartData.data.length - 1
                ? 4.5
                : 0;
            }}
            layout={{
              autoPadding: false,
              padding: isMediumSize ? { right: 5, top: 3 } : 0,
            }}
            formatLabel={lineChartData.formattedLabel}
          />
          <div
            className={cn(
              "mx-auto flex w-2/3 items-center justify-between space-x-2",
              {
                "!hidden": variant !== "stacked",
                "mt-5": loadingHistoricalData,
              },
            )}
          >
            {DATE_OPTIONS.map(({ label, value }, idx) => (
              <Text
                skeletonSize="lg"
                isLoading={loadingHistoricalData}
                key={idx}
                onClick={() => setSelectedDate(value)}
                className={cn(
                  "cursor-pointer rounded-[16px] p-2 px-3.75 text-xs font-semibold text-[#FFFFFF99] transition-all active:scale-90",
                  {
                    "bg-[#FFFFFF1A] !text-white": selectedDate === value,
                  },
                )}
              >
                {label}
              </Text>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "row-start-3 flex w-full flex-col @[361px]:col-start-2 @[361px]:row-start-1 @[361px]:items-end",
          )}
        >
          <AnimateNumber
            isLoading={loading}
            className="text-xl leading-[34.3px] @[361px]:leading-[20px]"
            format={(amount) =>
              formatAmount(
                amount,
                { compactDisplay: "long", notation: "standard" },
                currency,
              )
            }
          >
            {tokenInfo?.marketData.currentPrice?.[currency] || 0}
          </AnimateNumber>
          <AnimateNumber
            isLoading={loading}
            format={(amount) =>
              `${trend > 0 ? "+" : ""}${parseFloat(amount.toFixed(2))}%`
            }
            className={cn(
              "text-sm leading-[20.18px] text-white",
              getTrendColor(trend),
            )}
          >
            {trend}
          </AnimateNumber>
        </div>
        <div
          className={cn("col-span-2 hidden flex-col space-y-4.5 self-end", {
            "!flex": variant === "stacked",
          })}
        >
          <div className={cn("font-geist flex justify-around font-semibold")}>
            {getBalance.map(({ info, label }, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center space-y-1.5 whitespace-nowrap"
              >
                <Text className="text-xxxs text-[#FFFFFF66]">{label}</Text>
                <Text
                  skeletonSize="xl"
                  isLoading={loading}
                  className="text-lg leading-[normal]"
                >
                  {info}
                </Text>
              </div>
            ))}
          </div>
          <div className="flex w-full space-x-1.75">
            <Button
              disabled={loading}
              rounded="sm"
              size="lg"
              className="h-[43px] w-full"
            >
              Sell
            </Button>
            <Button
              disabled={loading}
              rounded="sm"
              size="lg"
              className="h-[43px] w-full"
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
      <div
        className={cn("font-geist hidden snap-y snap-mandatory text-xs", {
          "!flex flex-col": variant === "stacked",
        })}
      >
        {Object.entries(tokenInfoData).map(([header, detail], key) => (
          <div key={key} className="mb-4 snap-center font-semibold">
            <Text isLoading={loading} skeletonSize="lg">
              {header}
            </Text>
            <div className="mb-3 mt-2 h-[1px] w-full bg-[#FFFFFF1A]" />
            <div className="flex flex-col space-y-3">
              {detail.map(({ info, label }, idx) => (
                <div key={idx} className="flex w-full justify-between">
                  <Text
                    isLoading={loading}
                    skeletonSize="md"
                    className="text-[#FFFFFF66]"
                  >
                    {typeof label === "function" ? label() : label}
                  </Text>
                  <Text
                    isLoading={loading}
                    skeletonSize="sm"
                    className="max-w-41 overflow-auto"
                  >
                    {typeof info === "function" ? info() : info}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mb-4 mt-2 h-[1px] w-full bg-[#FFFFFF1A]" />
        <div className="flex space-x-2">
          {socialLinks
            .filter((item) => item.url)
            .map(({ icon, label, url }, key) => (
              <Button
                key={key}
                size="sm"
                className="h-[22px] space-x-1 rounded-[7px] text-xxxs"
              >
                <div className="aspect-square h-2.5">
                  <Icon name={icon as IconName} className="size-full" />
                </div>
                <Text isLoading={loading}>{label}</Text>
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}

const DATE_OPTIONS = [
  {
    label: "1H",
    value: "1h",
  },
  {
    label: "1D",
    value: "1d",
  },
  {
    label: "1W",
    value: "1w",
  },
  {
    label: "1Y",
    value: "1y",
  },
] as const;

const DEFAULT_DATA_BY_TIME = {
  "1d": [],
  "1h": [],
  "1w": [],
  "1y": [],
};

type DurationType = (typeof DATE_OPTIONS)[number]["value"];
