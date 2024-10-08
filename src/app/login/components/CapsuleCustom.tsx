"use client";

import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import Capsule, {
  ConstructorOpts,
  Environment,
  WalletType,
} from "@usecapsule/react-sdk";

import { signEvmMessage } from "./CapsuleSigningExamples";
import { CapsuleEmailAuthForm } from "./CapsuleEmailAuthForm";
import { CapsuleEmailVerification } from "./CapsuleEmailVerification";
import { CapsuleSignEvmMessages } from "./CapsuleSignEvmMessages";
import { CapsuleTwoFactorSetup } from "./CapsuleTwoFactorSetup";
import { useToast } from "./core/toast";
import { Button } from "./core";

const FOREGROUND_COLOR = "#87CEEB";
const BACKGROUND_COLOR = "#ffffff";

const CAPSULE_API_KEY = process.env.NEXT_PUBLIC_CAPSULE_API_KEY;

const CAPSULE_ENVIRONMENT = Environment.DEVELOPMENT;

const constructorOpts: ConstructorOpts = {
  emailPrimaryColor: FOREGROUND_COLOR,
  githubUrl: "https://github.com/theDreamOS",
  linkedinUrl: "https://www.linkedin.com/company/the-dream-os/",
  xUrl: "https://x.com/theDreamOS",
  homepageUrl: "https://dreamos.app",
  supportUrl: "",
  supportedWalletTypes: {
    [WalletType.EVM]: true,
    [WalletType.SOLANA]: true,
  },
};

export const capsuleClient = new Capsule(
  CAPSULE_ENVIRONMENT,
  CAPSULE_API_KEY,
  constructorOpts,
);

// Main component for email authentication and message signing tutorial
export const CapsuleCustom: React.FC<{}> = () => {
  const { toast } = useToast();

  const router = useRouter();

  // State management for the authentication flow
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [needsEmailVerification, setNeedsEmailVerification] =
    useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [userRecoverySecret, setUserRecoverySecret] = useState<string>("");

  const [walletId, setWalletId] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");

  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [selectedSigner, setSelectedSigner] = useState<string>("");

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState<boolean>(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>("");
  const [twoFactorVerificationCode, setTwoFactorVerificationCode] =
    useState<string>("");
  const [twoFactorSetupPhase, setTwoFactorSetupPhase] = useState<
    "setup" | "verify" | null
  >(null);

  const checkLoginStatus = useCallback(async () => {
    console.log("I AM CHECKING LOGIN STATUS");
    try {
      const isLoggedIn = await capsuleClient.isFullyLoggedIn();

      console.log({ isLoggedIn });

      if (isLoggedIn) {
        const wallets = capsuleClient.getWallets();

        console.log({ wallets });

        setWalletId(Object.values(wallets)[0].id!);
        setWalletAddress(Object.values(wallets)[0].address!);
        toast({
          title: "Logged In",
          description:
            "You're logged in and ready to sign messages with Capsule.",
        });
      }
      setNeedsEmailVerification(false);
      setIsUserLoggedIn(isLoggedIn);
    } catch (err) {
      console.error("Capsule login status check failed:", err);
      toast({
        title: "Capsule Login Check Error",
        description:
          "Failed to check Capsule login status. See console for details.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    console.log("I AM USING EFFECT");
    checkLoginStatus();
  }, [checkLoginStatus]);

  // Step 6: Handle user authentication
  // This function is called when the user clicks the "Continue" button
  const handleAuthenticateUser = async () => {
    setIsLoading(true);
    try {
      const isExistingUser = await capsuleClient.checkIfUserExists(email);

      console.log({ isExistingUser });

      if (isExistingUser) {
        const authUrl = await capsuleClient.initiateUserLogin(email);

        console.log({ authUrl });

        const popup = window.open(
          authUrl,
          "popup",
          "popup=true,width=400,height=500",
        );

        console.log({ popup });

        if (!popup) {
          console.error("Popup blocked. Please allow popups and try again.");
          toast({
            title: "Popup Blocked",
            description: "Please allow popups and try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const loginRes = await capsuleClient.waitForLoginAndSetup(popup);

        console.log({ loginRes });

        const { needsWallet } = loginRes;

        if (needsWallet) {
          const [wallet, secret] = await capsuleClient.createWallet();
          console.log({ wallet, secret });

          setWalletId(wallet.id!);
          setWalletAddress(wallet.address!);
          setUserRecoverySecret(secret || "");
        }
        await checkLoginStatus();
        if (isUserLoggedIn) {
          await checkAndSetupTwoFactor();
        }
      } else {
        await capsuleClient.createUser(email);
        setNeedsEmailVerification(true);
      }
    } catch (err) {
      console.error("Capsule authentication failed:", err);
      toast({
        title: "Capsule Authentication Error",
        description:
          "Failed to authenticate with Capsule. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 7: Handle email verification
  // This function is called when the user submits their verification code
  const handleVerifyEmail = async () => {
    setIsLoading(true);
    try {
      const url = await capsuleClient.verifyEmail(verificationCode);

      console.log({ verifyEmailUrl: url });
      window.open(url, "popup", "popup=true,width=400,height=500");

      const { recoverySecret } =
        await capsuleClient.waitForPasskeyAndCreateWallet();

      console.log({ recoverySecret });

      setUserRecoverySecret(recoverySecret || "");
      setIsUserLoggedIn(true);
      setNeedsEmailVerification(false);
      toast({
        title: "Capsule Email Verified",
        description: "Your email has been verified with Capsule.",
      });
      await checkLoginStatus();
      if (isUserLoggedIn) {
        await checkAndSetupTwoFactor();
      }
    } catch (err) {
      console.error("Capsule email verification failed:", err);
      toast({
        title: "Capsule Verification Error",
        description:
          "Failed to verify email with Capsule. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 8: Handle message signing
  // This function demonstrates how to sign a message using Capsule
  const handleSignMessage = async () => {
    setIsLoading(true);
    try {
      const signature = await signEvmMessage(
        capsuleClient,
        selectedSigner,
        message,
      );
      setSignature(signature);
      toast({
        title: "Capsule Message Signed",
        description: "Message has been signed successfully using Capsule.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Capsule message signing failed:", error);
      toast({
        title: "Capsule Signing Error",
        description:
          "Failed to sign message with Capsule. See console for details.",
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 9: Handle user logout
  // This function demonstrates how to log out a user from Capsule
  const handleLogout = async () => {
    console.log("initiating logout");
    try {
      await capsuleClient.logout();
      console.log("done logging out");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Capsule Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
    toast({
      title: "Capsule Logout",
      description: "You have been successfully logged out from Capsule.",
    });
    router.push("/");
    resetState();
  };

  // Helper function to reset the component state
  const resetState = () => {
    setEmail("");
    setVerificationCode("");
    setNeedsEmailVerification(false);
    setMessage("");
    setUserRecoverySecret("");
    setIsTwoFactorEnabled(false);
    setShowTwoFactorSetup(false);
    setTwoFactorSecret("");
    setTwoFactorVerificationCode("");
  };

  // Optional Step: Implement Two-Factor Authentication (2FA)
  // The following functions demonstrate how to add 2FA to your Capsule integration

  // Optional Step A: Check and setup 2FA
  const checkAndSetupTwoFactor = async () => {
    try {
      const { isSetup } = await capsuleClient.check2FAStatus();
      console.log({ isSetup });

      setIsTwoFactorEnabled(isSetup);
      if (isSetup) {
        setTwoFactorSetupPhase("verify");
      } else {
        setTwoFactorSetupPhase("setup");
      }
      setShowTwoFactorSetup(true);
    } catch (error) {
      console.error("Error checking 2FA status:", error);
      toast({
        title: "2FA Status Check Error",
        description: "Failed to check 2FA status. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Optional Step B: Initiate 2FA setup
  const handleSetup2FA = async () => {
    setIsLoading(true);
    try {
      const { uri } = await capsuleClient.setup2FA();
      console.log({ mfaUri: uri });

      setTwoFactorSecret(uri || "");
      toast({
        title: "2FA Setup Initiated",
        description:
          "Please scan the QR code or enter the secret in your authenticator app.",
      });
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      toast({
        title: "2FA Setup Error",
        description: "Failed to initiate 2FA setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Optional Step C: Enable 2FA
  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      console.log({ twoFactorVerificationCode });

      await capsuleClient.enable2FA(twoFactorVerificationCode);
      toast({
        title: "2FA Enabled",
        description:
          "Two-factor authentication has been successfully enabled for your account.",
      });
      setIsTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      toast({
        title: "2FA Enable Error",
        description:
          "Failed to enable 2FA. Please check your verification code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Optional Step D: Verify 2FA
  const handleVerify2FA = async () => {
    setIsLoading(true);
    try {
      // Assume capsuleClient has a method to verify 2FA
      await capsuleClient.verify2FA(email, twoFactorVerificationCode);
      toast({
        title: "2FA Verified",
        description: "Two-factor authentication code verified successfully.",
      });
      setShowTwoFactorSetup(false);
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      toast({
        title: "2FA Verification Error",
        description: "Failed to verify 2FA code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render the appropriate component based on the authentication state
  return (
    <>
      {isUserLoggedIn ? (
        showTwoFactorSetup ? (
          <CapsuleTwoFactorSetup
            isLoading={isLoading}
            twoFactorSecret={twoFactorSecret}
            verificationCode={twoFactorVerificationCode}
            setVerificationCode={setTwoFactorVerificationCode}
            handleSetup2FA={handleSetup2FA}
            handleEnable2FA={handleEnable2FA}
            handleVerify2FA={handleVerify2FA}
            onSkip={() => {
              setShowTwoFactorSetup(false);
              setTwoFactorSetupPhase(null);
            }}
            is2FAEnabled={isTwoFactorEnabled}
            twoFactorSetupPhase={twoFactorSetupPhase}
          />
        ) : (
          <>
            <div>Welcome! You are logged in.</div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full text-sm sm:w-auto"
            >
              Logout from Dream
            </Button>
          </>

          // <CapsuleSignEvmMessages
          //   isLoading={isLoading}
          //   signature={signature}
          //   walletId={walletId}
          //   walletAddress={walletAddress}
          //   userRecoverySecret={userRecoverySecret}
          //   message={message}
          //   selectedSigner={selectedSigner}
          //   isUserLoggedIn={isUserLoggedIn}
          //   setSelectedSigner={setSelectedSigner}
          //   setMessage={(e) => setMessage(e.target.value)}
          //   handleLogout={handleLogout}
          //   handleSignMessage={handleSignMessage}
          // />
        )
      ) : needsEmailVerification ? (
        <CapsuleEmailVerification
          isLoading={isLoading}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handleVerifyEmail={handleVerifyEmail}
          onCancel={resetState}
        />
      ) : (
        <CapsuleEmailAuthForm
          isLoading={isLoading}
          email={email}
          setEmail={(e) => setEmail(e.target.value)}
          handleAuthentication={handleAuthenticateUser}
          onCancel={resetState}
        />
      )}
    </>
  );
};
