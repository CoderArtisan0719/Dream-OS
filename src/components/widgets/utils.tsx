import { formatAmount, formatDigits } from "@/utils";
import { Icon } from "../ui/icon";
import { Tooltip } from "../ui/Tooltip";
import type {
  IOverview,
  ITokenInfo,
} from "@/app/api/v1/[[...slugs]]/models/tokens";

export function getTrendColor(trend: number | undefined) {
  if (!trend || trend === 0) return "";
  if (trend > 0) return "!text-[#29D161]";
  else if (trend < 0) return "!text-[#F42B2B]";
}

export const getTokenInfo = ({
  currency,
  tokenInfo,
  tokenOverview,
}: {
  currency: "usd";
  tokenInfo?: ITokenInfo;
  tokenOverview?: IOverview;
}) => ({
  Info: [
    {
      label: "Symbol",
      info: tokenInfo?.symbol,
    },
    {
      label: "Network",
      info: tokenInfo?.name,
    },
    {
      label: "Market Cap",
      info: formatAmount(
        tokenInfo?.marketData.marketCap?.[currency] || 0,
        { minimumFractionDigits: 2 },
        currency,
      ),
    },
    {
      label: "Total Supply",
      info: formatDigits(tokenInfo?.marketData.totalSupply || 0, {
        minimumFractionDigits: 2,
        notation: "compact",
        compactDisplay: "short",
      }),
    },
    {
      label: "Circulating Supply",
      info: formatDigits(tokenInfo?.marketData.circulatingSupply || 0, {
        minimumFractionDigits: 2,
        notation: "compact",
        compactDisplay: "short",
      }),
    },
    {
      label: "Max Supply",
      info: formatDigits(tokenInfo?.marketData.maxSupply || 0, {
        minimumFractionDigits: 2,
        notation: "compact",
        compactDisplay: "short",
      }),
    },
    {
      label: "Holders",
      info: formatDigits(tokenOverview?.holder || 0),
    },
  ],
  "24h Performance": [
    {
      label: "Volume",
      info: () => (
        <span className="inline-flex">
          <p className="text-white">
            {formatAmount(
              tokenInfo?.marketData.totalVolume?.[currency] || 0,
              { minimumFractionDigits: 2 },
              currency,
            )}
          </p>{" "}
          &nbsp;
          <p
            className={getTrendColor(
              tokenInfo?.marketData.volumeChange24h?.[currency] || 0,
            )}
          >
            {`${formatDigits(tokenInfo?.marketData.volumeChangePercentage24h?.[currency] || 0, { maximumFractionDigits: 2 })}%`}
          </p>
        </span>
      ),
    },
    {
      label: "Trades",
      info: () => (
        <span className="inline-flex">
          <p className="text-white">
            {formatDigits(tokenOverview?.trade24h || 0, {
              notation: "compact",
              minimumFractionDigits: 2,
            })}
          </p>{" "}
          &nbsp;
          <p
            className={getTrendColor(tokenOverview?.trade24hChangePercent || 0)}
          >{`${formatDigits(tokenOverview?.trade24hChangePercent || 0, { maximumFractionDigits: 2 })}%`}</p>
        </span>
      ),
    },
    {
      label: "Traders",
      info: () => (
        <span className="inline-flex">
          <p className="text-white">
            {formatDigits(tokenOverview?.tradersWalletHistory24h || 0, {
              notation: "compact",
              minimumFractionDigits: 2,
            })}
          </p>{" "}
          &nbsp;
          <p className="text-[#F42B2B]">{`${formatDigits(tokenOverview?.tradersWallet24hChangePercent || 0, { maximumFractionDigits: 2 })}%`}</p>
        </span>
      ),
    },
  ],
  Security: [
    {
      label: () => (
        <span className="inline-flex items-center space-x-1">
          <p>Top 10 Holders</p>
          <Tooltip label="Top 10 Holders of the token.">
            <Icon
              name="circle-info"
              className="cursor-pointer hover:text-white"
            />
          </Tooltip>
        </span>
      ),
      info: formatDigits(tokenOverview?.top10HolderPercent || 0),
    },
    {
      label: () => (
        <span className="inline-flex items-center space-x-1">
          <p>Mintable</p>
          <Tooltip label="Mint function enables contract owner to issue more tokens and cause the coin price to plummet. It is extremely risky. However if ownership is renounced, or is changed to a burn address, this function will be disabled.">
            <Icon
              name="circle-info"
              className="cursor-pointer hover:text-white"
            />
          </Tooltip>
        </span>
      ),
      info:
        !tokenOverview?.mintSlot &&
        !tokenOverview?.mintTime &&
        !tokenOverview?.mintTx
          ? "No"
          : "Yes",
    },
    {
      label: () => (
        <span className="inline-flex items-center space-x-1">
          <p>Mutable Info</p>
          <Tooltip label="The token information such as name, logo, website address can be changed by the owner.">
            <Icon
              name="circle-info"
              className="cursor-pointer hover:text-white"
            />
          </Tooltip>
        </span>
      ),
      info: tokenOverview?.mutableMetadata ? "No" : "Yes",
    },
    {
      label: () => (
        <span className="inline-flex items-center space-x-1">
          <p>Ownership Renounced</p>
          <Tooltip label="If token ownership is renounced, no one can execute functions such as mint more tokens.">
            <Icon
              name="circle-info"
              className="cursor-pointer hover:text-white"
            />
          </Tooltip>
        </span>
      ),
      info:
        !tokenOverview?.ownerAddress &&
        !tokenOverview?.ownerBalance &&
        !tokenOverview?.ownerPercentage
          ? "Yes"
          : "No",
    },
    {
      label: () => (
        <span className="inline-flex items-center space-x-1">
          <p>Update Authority</p>
          <Tooltip label="The token's update authority address.">
            <Icon
              name="circle-info"
              className="cursor-pointer hover:text-white"
            />
          </Tooltip>
        </span>
      ),
      info: tokenOverview?.metaplexUpdateAuthority,
    },
  ],
  SocialLinks: [
    {
      url: tokenInfo?.links.homepage ? tokenInfo?.links.homepage[0] : "",
      icon: "website",
      label: "Website",
    },
    {
      url: tokenInfo?.links.twitterScreenName || "",
      icon: "twitter-plain",
      label: "Twitter",
    },
    {
      url: tokenInfo?.links.telegramChannelIdentifier || "",
      icon: "telegram",
      label: "Telegram",
    },
  ],
});

export const getTokenData = ({
  currency,
  tokenOverview,
  tokenInfo,
}: {
  currency: "usd";
  tokenOverview?: IOverview;
  tokenInfo?: ITokenInfo;
}) => [
  {
    label: "Market Cap",
    info: formatAmount(
      tokenInfo?.marketData.marketCap?.[currency] || 0,
      { minimumFractionDigits: 2 },
      currency,
    ),
  },
  {
    label: "24h volume",
    info: formatAmount(
      tokenInfo?.marketData.totalVolume?.[currency] || 0,
      { minimumFractionDigits: 2 },
      currency,
    ),
  },
  {
    label: "Total Supply",
    info: formatDigits(tokenInfo?.marketData.totalSupply || 0, {
      minimumFractionDigits: 2,
      notation: "compact",
      compactDisplay: "short",
    }),
  },
  {
    label: "Top 10 holders",
    info: formatDigits(tokenOverview?.top10HolderPercent || 0),
  },
];

export const getBalanceAndVolume = (tokenInfo?: ITokenInfo) => [
  {
    label: "Your Balance",
    info: tokenInfo?.name ? "1.6M MOTHER" : "0.00",
  },
  {
    label: "Total Value",
    info: tokenInfo?.name ? formatAmount(161740.33, {}, "usd") : "0.00",
  },
];

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 != 0) || year % 400 === 0;
}

export function getPreviousTime(period: "1h" | "1d" | "1w" | "1y") {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const currentYear = new Date().getFullYear();
  const daysInYear = isLeapYear(currentYear) ? 366 : 365;

  const hour = 60 * 60;
  const day = 24 * hour;
  const week = 7 * day;
  const year = daysInYear * day;
  let fromDate = 0;
  switch (period) {
    case "1h":
      fromDate = currentTime - hour;
      break;
    case "1d":
      fromDate = currentTime - day;
      break;
    case "1w":
      fromDate = currentTime - week;
      break;
    case "1y":
      fromDate = currentTime - year;
      break;
    default:
      fromDate = 0;
      break;
  }
  return {
    fromDate,
    toDate: currentTime,
  };
}
