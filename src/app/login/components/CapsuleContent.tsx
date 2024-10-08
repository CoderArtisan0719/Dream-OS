"use client";

import {
  CapsuleModal,
  Network,
  OAuthMethod,
  OnRampAsset,
} from "@usecapsule/react-sdk";
import "@usecapsule/react-sdk/styles.css";
import { useRouter } from "next/navigation";
import { type FC } from "react";

import {
  CAPSULE_BACKGROUND_COLOR,
  CAPSULE_FOREGROUND_COLOR,
  useCapsule,
} from "@/app/AuthProvider";
import { getApi } from "@/utils/getApi";

export const CapsuleContent: FC<{}> = () => {
  const { capsuleClient } = useCapsule();
  const router = useRouter();

  const { api } = getApi();

  const handleSignIn = async () => {
    console.log("handling sign in");
    const isLoggedIn = await capsuleClient.isFullyLoggedIn();

    console.log({ isLoggedIn });

    if (!isLoggedIn) {
      console.log("not logged in so exiting early");
      return;
    }

    const wallets = capsuleClient.getWallets();
    const email = capsuleClient.getEmail();
    const phoneObj = capsuleClient.getPhone();

    // console.log({ capsuleClient });

    const phone = phoneObj.phone
      ? `${phoneObj?.countryCode} ${phoneObj?.phone}`
      : undefined;

    const capsuleId = Object.values(wallets)[0].userId;

    const session = capsuleClient.exportSession();

    console.log({ phone, email, capsuleId });

    if (!capsuleId) {
      console.error("no capsule user id found");
      return;
    }

    try {
      const res = await api.v1.users.index.post({
        capsuleId,
        email,
        phone,
        session,
      });

      if (res.error) {
        throw new Error(
          `${res.error.value.code} ${res.error.value.message}: Failed to log in`,
        );
      }

      if (!res.data.dreamId) {
        router.push("/claim");
      } else {
        router.push("/desktop");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleModalClose = async () => {
    console.log("we are closing the modal!");
    handleSignIn();
  };

  // Step 8: Handle Capsule Modal closure
  // This function is called when the modal is closed, either by the user or after successful login
  // You can perform any necessary cleanup or trigger app-specific actions here
  // const handleModalClose = async () => {
  //   console.log("we are closing the modal!");
  //   const isLoggedIn = await capsuleClient.isFullyLoggedIn();

  //   // after user signs in, check if they exist in our DB
  //   // if yes, check if they have a dream ID. If not, send them to onboarding. If yes, send them to desktop.

  //   // if not, serialize and export the session, make a POST request to our API which creates the new user and responds with a JWT

  //   // todo: fix this
  //   // const isOnboarded = false;
  //   // if (isLoggedIn) {
  //   //   if (isOnboarded) {
  //   //     router.push("/desktop");
  //   //   } else {
  //   //     router.push("/claim");
  //   //   }
  //   // }
  // };

  // Step 9: Handle message signing
  // This function demonstrates how to sign a message using Capsule
  // const handleSignMessage = async () => {
  //   setIsLoading(true);
  //   try {
  //     const signature = await signEvmMessage(
  //       capsuleClient,
  //       selectedSigner,
  //       message,
  //     );
  //     setSignature(signature);
  //     toast({
  //       title: "Capsule Message Signed",
  //       description: "Message has been signed successfully using Capsule.",
  //       duration: 3000,
  //     });
  //   } catch (error) {
  //     console.error("Capsule message signing failed:", error);
  //     toast({
  //       title: "Capsule Signing Error",
  //       description:
  //         "Failed to sign message with Capsule. See console for details.",
  //       duration: 3000,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // todo: make sure this resets the UI
  // const handleLogout = async () => {
  //   await capsuleClient.logout();
  //   toast({
  //     title: "Dream Logout",
  //     description: "You have been successfully logged out from DreamOS.",
  //   });
  //   router.push("/");
  // };

  return (
    <CapsuleModal
      bareModal={true}
      logo={"/dream_logo.svg"}
      theme={{
        backgroundColor: CAPSULE_BACKGROUND_COLOR,
        foregroundColor: CAPSULE_FOREGROUND_COLOR,
        oAuthLogoVariant: "dark",
      }}
      capsule={capsuleClient}
      networks={[
        Network.ETHEREUM,
        Network.ARBITRUM,
        Network.BASE,
        Network.OPTIMISM,
        Network.POLYGON,
      ]}
      isOpen={true}
      onClose={handleModalClose}
      appName="DreamOS"
      oAuthMethods={[
        OAuthMethod.GOOGLE,
        OAuthMethod.TWITTER,
        OAuthMethod.DISCORD,
        OAuthMethod.APPLE,
      ]}
      disableEmailLogin={false}
      disablePhoneLogin={false}
      onRampConfig={{
        network: Network.ETHEREUM,
        asset: OnRampAsset.ETHEREUM,
        providers: [
          { id: "STRIPE" },
          // Uncomment the following to add Ramp as a provider
          // {
          //   id: "RAMP",
          //   hostApiKey: "your-ramp-api-key",
          // },
        ],
        testMode: true,
      }}
      onModalStepChange={async (val) => {
        console.log("modal step change", val);

        if (val.currentStep === "LOGIN_DONE") {
          console.log("login done");

          handleSignIn();
        }
      }}
      // createWalletOverride={async (capsule) => {
      //   console.log("overriding wallet", capsule);
      //   return { walletIds: ["123"] };
      // }}
    />
  );

  // isUserLoggedIn ? (
  //   <CapsuleLoggedIn
  //     isLoading={isLoading}
  //     signature={signature}
  //     walletId={walletId}
  //     walletAddress={walletAddress}
  //     userRecoverySecret={userRecoverySecret}
  //     message={message}
  //     selectedSigner={selectedSigner}
  //     isUserLoggedIn={isUserLoggedIn}
  //     setSelectedSigner={setSelectedSigner}
  //     setMessage={(e: any) => setMessage(e.target.value)}
  //     handleLogout={handleLogout}
  //     handleSignMessage={handleSignMessage}
  //   />
  // ) : (
  //   <>
};

export default CapsuleContent;
