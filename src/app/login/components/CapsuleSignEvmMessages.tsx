import React from "react";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  Alert,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Label,
  Input,
} from "./core";
import { Toaster } from "./core/toast";

interface CapsuleSignEvmMessagesProps {
  isLoading: boolean;
  signature: string;
  walletId: string;
  walletAddress: string;
  userRecoverySecret: string;
  message: string;
  selectedSigner: string;
  isUserLoggedIn: boolean;
  setSelectedSigner: (value: string) => void;
  setMessage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
  handleSignMessage: () => void;
}

export const CapsuleSignEvmMessages: React.FC<CapsuleSignEvmMessagesProps> = ({
  isLoading,
  signature,
  walletId,
  walletAddress,
  userRecoverySecret,
  message,
  selectedSigner,
  isUserLoggedIn,
  setSelectedSigner,
  setMessage,
  handleLogout,
  handleSignMessage,
}) => (
  <>
    <CardHeader>
      <h2 className="text-xl font-bold">
        Capsule SDK: Message Signing Tutorial
      </h2>
      <p className="text-sm text-muted-foreground">
        Learn how to use Capsule SDK to sign messages with various Ethereum
        libraries. This tutorial demonstrates Capsule&apos;s integration with
        popular signing libraries.
      </p>
    </CardHeader>
    <CardContent className="flex flex-grow flex-col items-start overflow-auto">
      <Alert className="mb-4 break-words">
        <strong>Capsule Wallet ID:</strong> {walletId || "Not available"}
      </Alert>
      <Alert className="mb-4 break-words">
        <strong>Capsule Wallet Address:</strong>{" "}
        {walletAddress || "Not available"}
      </Alert>
      {userRecoverySecret && (
        <Alert className="mb-4 break-words">
          <strong>Capsule Recovery Secret:</strong>{" "}
          {userRecoverySecret || "Not available"}
        </Alert>
      )}
      <Label htmlFor="capsule-signer-select" className="mb-2 block">
        Select Capsule-compatible Signer Library:
      </Label>
      <Select onValueChange={setSelectedSigner}>
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Choose a signer library" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Capsule-compatible Signers</SelectLabel>
            <SelectItem value="ethers-v5-integration">
              Ethers v5 with Capsule
            </SelectItem>
            <SelectItem value="ethers-v6-integration">
              Ethers v6 with Capsule
            </SelectItem>
            <SelectItem value="viem-v1-integration">
              Viem v1 with Capsule
            </SelectItem>
            <SelectItem value="viem-v2-integration">
              Viem v2 with Capsule
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label htmlFor="capsule-message-input" className="mb-2 block">
        Message to Sign with Capsule:
      </Label>
      <Input
        id="capsule-message-input"
        name="capsuleMessageToSign"
        value={message}
        onChange={setMessage}
        placeholder="Enter a message to sign using Capsule"
        className="mb-4 w-full"
      />
      <Alert className="mb-4 break-words">
        {signature ? (
          <>
            <strong>Signature:</strong>
            <p className="mt-2 font-mono text-sm">{signature}</p>
          </>
        ) : (
          <>
            <strong>Signature Status:</strong>{" "}
            {isLoading ? "Signing message..." : "No signature generated yet"}
          </>
        )}
      </Alert>
    </CardContent>
    <CardFooter className="flex flex-col justify-between gap-2 p-4 sm:flex-row">
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full text-sm sm:w-auto"
      >
        Logout from Dream
      </Button>
      <Button
        onClick={handleSignMessage}
        disabled={!message || !selectedSigner || !isUserLoggedIn || isLoading}
        className="w-full text-sm sm:w-auto"
      >
        {isLoading
          ? "Signing with Capsule..."
          : "Sign Evm Message using Capsule"}
      </Button>
    </CardFooter>
    <Toaster />
  </>
);
