import Image from "next/image";
import explorerImage from "../../../../public/images/assets/Explorer.png";

// Todo: Add Tooltip to provide more info on icon similar to mac
export function Dock() {
  return (
    <div className="shadow-dock fixed bottom-2 left-1/2 z-10 flex w-min -translate-x-1/2 space-x-3 rounded-[8px] bg-white bg-opacity-80 px-2 py-2 backdrop-blur-[20px] sm:space-x-2 md:rounded-[16px] md:pb-4">
      {DEFAULT_DOCK_OPTIONS.map(({ label, image }) => (
        <div
          className="size-6 cursor-pointer overflow-hidden transition-all hover:scale-105 hover:drop-shadow-2xl active:scale-95 md:size-12"
          key={label}
        >
          <Image src={image} alt="app" width={48} height={48} />
        </div>
      ))}
    </div>
  );
}

const DEFAULT_DOCK_OPTIONS = [
  {
    label: "Explorer",
    image: explorerImage,
  },
  {
    label: "Pump.fun",
    image: "/images/assets/pump-fun.png",
  },
  {
    label: "File Explorer",
    image: "/images/assets/File-Explorer.png",
  },
  {
    label: "Setting",
    image: "/images/assets/Setting.png",
  },
  {
    label: "Shop",
    image: "/images/assets/Shop.png",
  },
  {
    label: "Twitter",
    image: "/images/assets/Twitter.png",
  },
  {
    label: "Uniswap",
    image: "/images/assets/Uniswap.png",
  },
  {
    label: "Wallet",
    image: "/images/assets/Wallet.png",
  },
  {
    label: "Youtube",
    image: "/images/assets/Youtube.png",
  },
];
