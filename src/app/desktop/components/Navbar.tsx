import { getUser } from "@/app/data/users/actions";
import { Icon, IconName } from "@/components/ui/icon";
import { formatTime } from "@/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

async function DreamProfile() {
  const user = await getUser();
  return (
    <span className="inline-flex items-center bg-white px-3 font-semibold">
      {user.dreamId || (
        <Link
          href="/claim/choose"
          className="cursor-pointer underline hover:no-underline"
        >
          &lt;get your Dream ID&gt;
        </Link>
      )}
    </span>
  );
}

export function Navbar() {
  return (
    <nav className="shadow-dock fixed left-4 top-[31px] flex h-[29px] w-[calc(100vw-32px)] items-center justify-between rounded-[8px] bg-white bg-opacity-80 pl-1 pr-4 text-xxxs text-black transition-all">
      <div className="active:scale-120 flex h-[21px] w-fit cursor-pointer overflow-hidden rounded-[6px] border border-black border-opacity-10 drop-shadow-none transition-all hover:scale-105 hover:drop-shadow-2xl">
        <div className="size-[21px]">
          <Image
            alt="profile"
            src="/images/stock/avatar.png"
            width={21}
            height={21}
            className="object-cover"
          />
        </div>
        <Suspense
          fallback={
            <span>
              <Loader2 className="mx-3 my-0.5 h-4 w-4 animate-spin text-gray-500" />
            </span>
          }
        >
          <DreamProfile />
        </Suspense>
      </div>
      <div>
        <div className="flex space-x-3">
          <span className="inline-flex space-x-1">
            <p className="font-medium text-[#646362]">SOL/USD</p>
            <p className="font-semibold">$60.31</p>
          </span>
          <span className="inline-flex space-x-1">
            <p className="font-medium text-[#646362]">Gas</p>
            <span className="inline-flex items-center">
              <p className="font-semibold">$0.0003 </p>
              <span className="ml-1 size-[4px] animate-ping rounded-full bg-[#00A369]" />
            </span>
          </span>
        </div>
      </div>
      <div className="hidden items-center space-x-4 font-semibold sm:flex">
        <div className="flex items-center space-x-2">
          {NAV_OPTION.map(({ icon, key }) => (
            <div
              key={key}
              className="inline-flex size-[18px] cursor-pointer items-center justify-center transition-all active:scale-90"
            >
              <Icon name={icon} className="size-3" />
            </div>
          ))}
        </div>
        <div>
          <p>{formatTime(new Date())}</p>
        </div>
      </div>
    </nav>
  );
}

const NAV_OPTION: {
  icon: IconName;
  key: string;
}[] = [
  {
    icon: "star",
    key: "star",
  },
  {
    icon: "search",
    key: "search",
  },
  {
    icon: "refresh",
    key: "refresh",
  },
];
