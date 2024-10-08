"use client";

import { SwapWidgets } from "@/components/widgets/SwapWidget";
import { TokenCharts } from "@/components/widgets/tokenchart";

export default function DesktopStart() {
  return (
    <div className="my-2 mt-[76px] grid w-full auto-cols-[150px] grid-flow-row auto-rows-[150px] justify-center gap-2 overflow-auto md:justify-start md:gap-[17px] md:overflow-hidden">
      <div className="col-span-2 row-span-2">
        <SwapWidgets />
      </div>
      <div className="col-span-2 row-span-2 md:col-start-3">
        <TokenCharts token="ethereum" variant="stacked" />
      </div>
      <div className="col-span-2 row-span-2">
        <SwapWidgets />
      </div>
      <div className="col-span-2 row-span-2">
        <SwapWidgets />
      </div>
    </div>
  );
}
