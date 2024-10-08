export function formatAmount(
  amount: number | string,
  options?: Intl.NumberFormatOptions,
  currency: "usd" = "usd",
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    compactDisplay: "short",
    ...options,
  }).format(typeof amount === "number" ? amount : Number(amount));
}

export function formatDigits(
  digits: number | string,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat("en-US", options).format(
    typeof digits === "number" ? digits : Number(digits),
  );
}

export function formatDate(date: number, options?: Intl.DateTimeFormatOptions) {
  const createdDate = new Date(date);
  return createdDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // to keep it in 24-hour format
      ...options,
    })
    .replace(",", "");
}

export function formatTime(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short", // e.g., 'Dec'
    day: "numeric", // e.g., '1'
    hour: "numeric", // e.g., '4'
    minute: "2-digit", // e.g., '16'
    hour12: true, // Use 12-hour clock and AM/PM notation
  });
}

export async function createRequest(
  endpoint: string,
  method: "POST" | "GET" | "DELETE" | "PUT" | "PATCH",
  body?: Record<string, any> | null,
  configHeaders: RequestInit["headers"] & { "Content-Type"?: any } = {},
) {
  const headers = configHeaders;
  try {
    const config: any = { method, headers };
    if (body)
      config.body =
        headers?.["Content-Type"] === "application/json"
          ? JSON.stringify(body)
          : body;
    const res = await fetch(endpoint, config);
    const response = await res.json();
    if (!res.ok) return [null, response];
    return [response, null];
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export function createParams(payload: any) {
  const params = new URLSearchParams();
  Object.keys(payload).map((key) => {
    if (typeof payload[key] === "string") {
      payload[key] = `${payload[key]}`.trim();
    }
    if (payload[key] !== undefined || payload[key] !== null) {
      params.set(key, payload[key]);
    }
  });
  return params;
}

export function getFillGradient(
  topColor = "#86EFAC",
  bottomColor = "transparent",
) {
  return ({ chart: { ctx, chartArea } }: any) => {
    if (!chartArea) return;
    const { top, bottom } = chartArea;
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(1, bottomColor);
    return gradient;
  };
}

export function constructPhoneString(phoneObj: {
  countryCode?: string;
  phone?: string;
}) {
  return phoneObj.phone
    ? `${phoneObj?.countryCode} ${phoneObj?.phone}`
    : undefined;
}
