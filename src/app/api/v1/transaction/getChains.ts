export default async function getChains() {
  const url = "https://dln.debridge.finance/v1.0/supported-chains-info";
  const response = await fetch(url);
  const data = response.json();
  return data;
}
