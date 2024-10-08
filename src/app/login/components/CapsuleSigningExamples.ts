import type Capsule from "@usecapsule/web-sdk";

// Viem v2
import {
  createCapsuleViemClient as createCapsuleViemClientV2,
  createCapsuleAccount as createCapsuleViemAccountV2,
} from "@usecapsule/viem-v2-integration";
import {
  WalletClientConfig as WalletClientConfigViemV2,
  http as httpViemV2,
} from "viem";
import { sepolia as sepoliaViemV2 } from "viem/chains";

const signWithViemV2 = async (
  capsule: Capsule,
  message: string,
): Promise<string> => {
  if (!capsule) {
    throw new Error("Capsule not instantiated");
  }
  try {
    const walletClientConfig: WalletClientConfigViemV2 = {
      chain: sepoliaViemV2,
      transport: httpViemV2(process.env.NEXT_PUBLIC_RPC_URL),
    };
    const viemClient = createCapsuleViemClientV2(capsule, walletClientConfig);

    return await viemClient.signMessage({
      account: createCapsuleViemAccountV2(capsule),
      message: message,
    });
  } catch (error) {
    throw new Error(`Error signing message with signer: viem-v2, ${error}`);
  }
};

export const signEvmMessage = async (
  capsule: Capsule,
  selectedSigner: string,
  message: string,
): Promise<string> => {
  switch (selectedSigner) {
    case "viem-v2-integration":
      return await signWithViemV2(capsule, message);
    default:
      throw new Error(
        "Invalid signer. Please select a valid signer to sign the message.",
      );
  }
};
