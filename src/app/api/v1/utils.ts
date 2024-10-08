export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    // console.log("apiBaseUrl: client-side", window.location.origin);
    // for storybook
    if (window.location.origin.includes("6006")) {
      return "http://localhost:3000";
    }
    // Client-side
    return window.location.origin;
  }
  // Server-side
  if (process.env.VERCEL_URL) {
    // console.log({ VERCEL_URL: process.env.VERCEL_URL });
    // Vercel deployment
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local development
  return "http://localhost:3000";
}
