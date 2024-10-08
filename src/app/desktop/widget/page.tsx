"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    deBridge: {
      widget: (config: any) => void;
    };
  }
}

export default function DesktopStart() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (scriptLoaded && typeof window.deBridge !== "undefined") {
      console.log({ debridge: window.deBridge });
      window.deBridge.widget({
        v: "1",
        element: "debridgeWidget",
        title: "DreamOS Swap",
        description: "instant cross-chain swaps",
        width: "600",
        height: "800",
        r: null,
        supportedChains:
          '{"inputChains":{"1":"all","10":"all","56":"all","100":"all","137":"all","1088":"all","1890":"all","7171":"all","8453":"all","42161":"all","43114":"all","59144":"all","7565164":"all","245022934":"all"},"outputChains":{"1":"all","10":"all","56":"all","100":"all","137":"all","1088":"all","1890":"all","7171":"all","8453":"all","42161":"all","43114":"all","59144":"all","7565164":"all","245022934":"all"}}',
        inputChain: 8453,
        outputChain: 7565164,
        inputCurrency: "",
        outputCurrency: "",
        address: "",
        showSwapTransfer: true,
        amount: "0.1",
        isAmountFromNotModifiable: false,
        lang: "en",
        mode: "deswap",
        isEnableCalldata: false,
        styles:
          "eyJidG5QYWRkaW5nIjp7InRvcCI6bnVsbCwicmlnaHQiOm51bGwsImJvdHRvbSI6bnVsbCwibGVmdCI6bnVsbH19",
        theme: "dark",
        isHideLogo: false,
        logo: "https://www.dreamos.app/img/asset/dreamosblack.png",
        disabledWallets: [],
        disabledElements: [],
      });
    }
  }, [scriptLoaded]);

  return (
    <div className="relative z-10 mx-auto flex h-full min-h-screen items-center p-12">
      <Script
        src="https://app.debridge.finance/assets/scripts/widget.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div id="debridgeWidget"></div>
    </div>
  );
}
