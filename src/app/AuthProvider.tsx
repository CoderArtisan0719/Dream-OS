"use client";

import Capsule, {
  ConstructorOpts,
  Environment,
  WalletType,
} from "@usecapsule/react-sdk";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

export const CAPSULE_FOREGROUND_COLOR = "#4682B4";
export const CAPSULE_BACKGROUND_COLOR = "#ffffff";
const CAPSULE_ENVIRONMENT = Environment.DEVELOPMENT;
const CAPSULE_API_KEY = process.env.NEXT_PUBLIC_CAPSULE_API_KEY;

const constructorOpts: ConstructorOpts = {
  emailPrimaryColor: CAPSULE_FOREGROUND_COLOR,
  xUrl: "https://x.com/theDreamOS",
  homepageUrl: "https://dreamos.app",
  supportUrl: "",
  supportedWalletTypes: {
    [WalletType.EVM]: true,
    [WalletType.SOLANA]: true,
  },
};

const capsuleClient = new Capsule(
  CAPSULE_ENVIRONMENT,
  CAPSULE_API_KEY,
  constructorOpts,
);

export const AuthContext = createContext({
  capsuleClient,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // const [user, setUser] = useState<{ dreamId: string }>({ dreamId: "bloke" });

  // const [user, setUser] = useState<{ dreamId: string }>({ dreamId: "bloke" });

  useEffect(() => {
    (async function redirectUserIfLoggedIn() {
      try {
        console.log("checking login status");
        const isLoggedIn = await capsuleClient.isFullyLoggedIn();

        console.log({ isLoggedIn });

        if (!isLoggedIn) {
          router.push("/login");
          return;
        }

        if (pathname === "/" || pathname === "/login") {
          router.push("/desktop");
        }

        // setTimeout(() => {
        //   setUser({ dreamId: "smoke" });
        // }, 4000);

        console.log("done checking login status");
      } catch (err) {
        console.error("Capsule login status check failed:", err);
        // toast({
        //   title: "Capsule Login Check Error",
        //   description:
        //     "Failed to check Capsule login status. See console for details.",
        //   variant: "destructive",
        // });
      }
    })();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ capsuleClient }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCapsule() {
  return useContext(AuthContext);
}
