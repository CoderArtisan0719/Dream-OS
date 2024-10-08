import React, { Fragment } from "react";
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

export const CapsuleLoggedIn: React.FC<CapsuleSignEvmMessagesProps> = ({
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
  <Fragment>
    <CardContent className="flex flex-grow flex-col items-center justify-center overflow-auto">
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
    </CardContent>
    <CardFooter className="flex flex-col justify-between gap-2 p-4 sm:flex-row">
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full text-sm sm:w-auto"
      >
        Logout from Dream
      </Button>
    </CardFooter>
    <Toaster />
  </Fragment>
);
