export default async function getTokenOut({
  chainId,
  tokenIn,
  tokenInAmount,
  tokenOut,
}: {
  chainId: string;
  tokenIn: string;
  tokenInAmount: string;
  tokenOut: string;
}) {
  const url = `https://dln.debridge.finance/v1.0/chain/estimation?chainId=${chainId}&tokenIn=${tokenIn}&tokenInAmount=${tokenInAmount}&tokenOut=${tokenOut}`;
  const response = await fetch(url);
  const data = response.json();
  return data;
}
