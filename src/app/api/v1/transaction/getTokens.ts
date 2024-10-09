export default async function getTokens({ chainId }: { chainId: number }) {
  const url = `https://dln.debridge.finance/v1.0/token-list?chainId=${chainId}`;
  const response = await fetch(url);
  const data = response.json();
  return data;
}
