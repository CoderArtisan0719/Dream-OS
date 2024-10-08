import { Elysia, t } from "elysia";

import { createParams } from "@/utils";
import { authGuardPlugin } from "@/app/api/v1/plugins";

const COIN_GECKO_API_KEY = process.env.COIN_GECKO_API_KEY || "";
const BIRD_EYE_API_KEY = process.env.BIRD_EYE_API_KEY || "";

const valueInCurrencyType = t.Object({
  usd: t.Optional(t.Number()),
});
const trendType = t.Array(t.Array(t.Number(), t.Number()));
const optionalNullableString = t.Optional(t.Union([t.String(), t.Null()]));
const optionalNullableNumber = t.Optional(t.Union([t.Number(), t.Null()]));

const coinInfoResponseType = t.Object({
  name: t.String(),
  symbol: t.String(),
  image: t.Object({
    large: t.String(),
    small: t.String(),
    thumb: t.String(),
  }),
  links: t.Object({
    homepage: t.Array(t.String()),
    twitterScreenName: t.String(),
    telegramChannelIdentifier: t.String(),
  }),
  marketData: t.Object({
    ath: valueInCurrencyType,
    circulatingSupply: t.Number(),
    currentPrice: valueInCurrencyType,
    fullyDilutedValuation: valueInCurrencyType,
    marketCap: valueInCurrencyType,
    marketCapChange24h: t.Number(),
    marketCapChange24hInCurrency: valueInCurrencyType,
    marketCapChangePercentage24h: t.Number(),
    marketCapChangePercentage24hInCurrency: valueInCurrencyType,
    maxSupply: t.Nullable(t.Number()),
    priceChange24h: t.Nullable(t.Number()),
    priceChange24hInCurrency: valueInCurrencyType,
    priceChangePercentage1hInCurrency: valueInCurrencyType,
    priceChangePercentage7d: t.Number(),
    priceChangePercentage7dInCurrency: valueInCurrencyType,
    priceChangePercentage24h: t.Number(),
    priceChangePercentage24hInCurrency: valueInCurrencyType,
    priceChangePercentage30d: t.Number(),
    priceChangePercentage30dInCurrency: valueInCurrencyType,
    totalSupply: t.Number(),
    totalValueLocked: t.Nullable(t.Number()),
    totalVolume: valueInCurrencyType,
    volumeChange24h: valueInCurrencyType,
    volumeChangePercentage24h: valueInCurrencyType,
  }),
});

const overviewResponse = t.Object({
  metaplexUpdateAuthority: optionalNullableString,
  top10HolderBalance: optionalNullableNumber,
  top10HolderPercent: optionalNullableNumber,
  top10UserBalance: optionalNullableNumber,
  top10UserPercent: optionalNullableNumber,
  mutableMetadata: t.Optional(t.Boolean()),
  creatorAddress: t.Nullable(t.String()),
  creatorBalance: t.Nullable(t.Number()),
  creatorOwnerAddress: optionalNullableString,
  creatorPercentage: t.Optional(t.Number()),
  ownerAddress: optionalNullableString,
  ownerBalance: t.Optional(t.Number()),
  ownerOfOwnerAddress: optionalNullableString,
  ownerPercentage: t.Optional(t.Number()),
  mintSlot: optionalNullableNumber,
  mintTime: optionalNullableNumber,
  mintTx: optionalNullableString,
  holder: optionalNullableNumber,
  trade24h: t.Nullable(t.Number()),
  trade24hChangePercent: t.Nullable(t.Number()),
  tradersWallet24h: t.Nullable(t.Number()),
  tradersWalletHistory24h: t.Nullable(t.Number()),
  tradersWallet24hChangePercent: t.Nullable(t.Number()),
});

const tokenListResponse = t.Array(
  t.Object({
    id: t.String(),
    symbol: t.String(),
    name: t.String(),
    platforms: t.Record(t.String(), t.String()),
  }),
);

export type ITokenInfo = typeof coinInfoResponseType.static;
export type IOverview = typeof overviewResponse.static;
export type ITrend = typeof trendType.static;
export type ITokenList = typeof tokenListResponse.static;

export const tokens = new Elysia({
  prefix: "/tokens",
  tags: ["tokens"],
})
  .use(authGuardPlugin)
  .get(
    "/list",
    async () => {
      const resp = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/list?${createParams({
          include_platform: true,
          status: "active",
        })}`,
        {
          headers: {
            "x-cg-pro-api-key": COIN_GECKO_API_KEY,
          },
        },
      );
      const data = await resp.json();
      return data;
    },
    {
      response: tokenListResponse,
    },
  )
  .get(
    "/networks",
    async () => {
      const resp = await fetch("https://public-api.birdeye.so/defi/networks", {
        headers: {
          "X-API-KEY": BIRD_EYE_API_KEY,
        },
      });
      const data = await resp.json();
      return data.data;
    },
    {
      response: t.Array(t.String()),
    },
  )
  .get(
    "/info/:id",
    async ({ params: { id }, query: { baseCurrency } }) => {
      const tokenReq = fetch(
        `https://pro-api.coingecko.com/api/v3/coins/${id}?${createParams({
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        })}`,
        {
          headers: {
            "x-cg-pro-api-key": COIN_GECKO_API_KEY,
          },
        },
      );
      const simpleTokenReq = fetch(
        `https://pro-api.coingecko.com/api/v3/simple/price?${createParams({
          ids: id,
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
          include_last_updated_at: true,
          precision: 2,
          vs_currencies: baseCurrency,
        })}`,
        {
          headers: {
            "x-cg-pro-api-key": COIN_GECKO_API_KEY,
          },
        },
      );

      const [resp, marketResp] = await Promise.all([tokenReq, simpleTokenReq]);
      const data = await resp.json();
      const marketData = await marketResp.json();

      return {
        name: data.id,
        symbol: data.symbol,
        image: {
          large: data.image.large,
          small: data.image.small,
          thumb: data.image.thumb,
        },
        links: {
          homepage: data.links.homepage,
          telegramChannelIdentifier: data.links.telegram_channel_identifier,
          twitterScreenName: data.links.twitter_screen_name,
        },
        marketData: {
          ath: {
            usd: data.market_data.ath[baseCurrency],
          },
          circulatingSupply: data.market_data.circulating_supply,
          currentPrice: {
            usd: data.market_data.current_price[baseCurrency],
          },
          fullyDilutedValuation: {
            usd: data.market_data.fully_diluted_valuation[baseCurrency],
          },
          marketCap: {
            usd: data.market_data.market_cap[baseCurrency],
          },
          marketCapChange24h: data.market_data.market_cap_change_24h,
          marketCapChange24hInCurrency: {
            usd: data.market_data.market_cap_change_24h_in_currency[
              baseCurrency
            ],
          },
          marketCapChangePercentage24h:
            data.market_data.market_cap_change_percentage_24h,
          marketCapChangePercentage24hInCurrency: {
            usd: data.market_data.market_cap_change_24h_in_currency[
              baseCurrency
            ],
          },
          priceChange24h: data.market_data.price_change_24h,
          priceChange24hInCurrency: {
            usd: data.market_data.price_change_24h_in_currency[baseCurrency],
          },
          priceChangePercentage1hInCurrency: {
            usd: data.market_data.price_change_percentage_1h_in_currency[
              baseCurrency
            ],
          },
          priceChangePercentage24h:
            data.market_data.price_change_percentage_24h,
          priceChangePercentage24hInCurrency: {
            usd: data.market_data.price_change_percentage_24h_in_currency[
              baseCurrency
            ],
          },
          priceChangePercentage30d:
            data.market_data.price_change_percentage_30d,
          priceChangePercentage30dInCurrency: {
            usd: data.market_data.price_change_percentage_30d_in_currency[
              baseCurrency
            ],
          },
          priceChangePercentage7d: data.market_data.price_change_percentage_7d,
          priceChangePercentage7dInCurrency: {
            usd: data.market_data.price_change_percentage_7d_in_currency[
              baseCurrency
            ],
          },
          totalSupply: data.market_data.total_supply,
          totalVolume: {
            usd: data.market_data.total_volume[baseCurrency],
          },
          maxSupply: data.market_data.max_supply,
          totalValueLocked:
            data.market_data.total_value_locked?.[baseCurrency] || 0,
          volumeChange24h: {
            usd: marketData[id].usd_24h_vol,
          },
          volumeChangePercentage24h: {
            usd: marketData[id].usd_24h_change,
          },
        },
      };
    },
    {
      response: coinInfoResponseType,
      query: t.Object({
        baseCurrency: t.String(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .get(
    "/trend/:id",
    async ({ params: { id }, query: { baseCurrency, fromDate, toDate } }) => {
      const resp = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart/range?${createParams(
          {
            vs_currency: baseCurrency,
            from: fromDate,
            to: toDate,
          },
        )}`,
        {
          headers: {
            "x-cg-pro-api-key": COIN_GECKO_API_KEY,
          },
        },
      );
      const data = await resp.json();
      return {
        prices: data.prices,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        baseCurrency: t.String(),
        fromDate: t.Number(),
        toDate: t.Number(),
      }),
      response: t.Object({
        prices: trendType,
      }),
    },
  )
  .get(
    "/overview/:address",
    async ({ params: { address }, query: { chain } }) => {
      const tokenSecReq = fetch(
        `https://public-api.birdeye.so/defi/token_security?address=${address}`,
        {
          headers: {
            "x-chain": chain,
            "X-API-KEY": BIRD_EYE_API_KEY,
          },
        },
      );
      const tokenOverviewReq = fetch(
        `https://public-api.birdeye.so/defi/token_overview?address=${address}`,
        {
          headers: {
            "x-chain": chain,
            "X-API-KEY": BIRD_EYE_API_KEY,
          },
        },
      );
      const [resp, overviewResp] = await Promise.all([
        tokenSecReq,
        tokenOverviewReq,
      ]);
      const data = await resp.json();
      const overviewData = await overviewResp.json();

      return {
        creatorAddress: data.data.creatorAddress,
        creatorBalance: parseFloat(data.data.creatorBalance || 0),
        creatorOwnerAddress: data.data.creatorOwnerAddress,
        creatorPercentage: parseFloat(data.data.creatorPercentage || 0),
        metaplexUpdateAuthority: data.data.metaplexUpdateAuthority,
        mintSlot: data.data.mintSlot,
        mintTime: data.data.mintTime,
        mintTx: data.data.mintTx,
        mutableMetadata: data.data.mutableMetadata,
        ownerAddress: data.data.ownerAddress,
        ownerBalance: parseFloat(data.data.ownerBalance || 0),
        ownerOfOwnerAddress: data.data.ownerOfOwnerAddress,
        top10HolderBalance: parseFloat(data.data.top10HolderBalance || 0),
        top10HolderPercent: parseFloat(data.data.top10HolderPercent || 0),
        ownerPercentage: parseFloat(data.data.ownerPercentage || 0),
        top10UserBalance: parseFloat(data.data.top10UserBalance || 0),
        top10UserPercent: parseFloat(data.data.top10UserPercent || 0),
        holder: overviewData.data.holder,
        trade24h: overviewData.data.trade24h,
        trade24hChangePercent: overviewData.data.trade24hChangePercent,
        tradersWallet24h: overviewData.data.uniqueWallet24h,
        tradersWalletHistory24h: overviewData.data.uniqueWalletHistory24h,
        tradersWallet24hChangePercent:
          overviewData.data.uniqueWallet24hChangePercent,
      };
    },
    {
      params: t.Object({
        address: t.String(),
      }),
      query: t.Object({
        chain: t.String(),
      }),
      response: overviewResponse,
    },
  );
