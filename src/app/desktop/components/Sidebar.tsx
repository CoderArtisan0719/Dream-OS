import Image from "next/image";
// import pumpFunImage from "@/public/images/assets/pump-fun.png";
import pumpFunImage from "../../../../public/images/assets/pump-fun.png";

export function Sidebar() {
  return (
    <div className="fixed right-5 top-[76px] flex flex-col space-y-5 font-sans text-white">
      {SIDEBAR_OPTIONS.map(({ image, label }, idx) => (
        <div
          key={idx}
          className="flex cursor-pointer flex-col items-center space-y-2 transition-all hover:scale-105 hover:drop-shadow-2xl active:scale-95"
        >
          <div className="size-12 overflow-hidden">
            <Image src={image} alt="app" width={48} height={48} />
          </div>
          <p className="text-xs font-medium">{label}</p>
        </div>
      ))}
    </div>
  );
}

const SIDEBAR_OPTIONS = [
  {
    label: "Pump.fun",
    image: pumpFunImage,
  },
  {
    label: "Dexscreener",
    image: "/images/assets/dexscreener.png",
  },
  {
    label: "Lens",
    image: "/images/assets/lens.png",
  },
  {
    label: "Uniswap",
    image: "/images/assets/Uniswap.png",
  },
  {
    label: "Coinbase",
    image: "/images/assets/coinbase.png",
  },
  {
    label: "ByBit",
    image: "/images/assets/bybit.png",
  },
];
