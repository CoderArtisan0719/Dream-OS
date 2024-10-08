import React from "react";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  Label,
  Input,
} from "./core";

interface CapsuleEmailAuthFormProps {
  isLoading: boolean;
  email: string;
  setEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAuthentication: () => void;
  onCancel: () => void;
}

export const CapsuleEmailAuthForm: React.FC<CapsuleEmailAuthFormProps> = ({
  isLoading,
  email,
  setEmail,
  handleAuthentication,
  onCancel,
}) => (
  <>
    <CardHeader>
      <h2 className="text-xl font-bold">Capsule Email Authentication</h2>
      <p className="text-sm text-muted-foreground">
        Learn how to implement email-based authentication using the Capsule Web
        SDK. This tutorial demonstrates the process for both new and existing
        users.
      </p>
    </CardHeader>
    <CardContent className="flex flex-grow flex-col items-start overflow-auto">
      <Label htmlFor="capsule-email-input" className="mb-2 block">
        Enter Your Email for Capsule Authentication:
      </Label>
      <Input
        id="capsule-email-input"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        className="mb-4"
        aria-describedby="capsule-email-description"
      />
      <p
        id="capsule-email-description"
        className="text-xs text-muted-foreground"
      >
        Capsule will use this email to authenticate you. If you&apos;re a new
        user, Capsule will send a verification code to this email address.
      </p>
    </CardContent>
    <CardFooter className="flex flex-col justify-between gap-2 p-4 sm:flex-row">
      <Button
        onClick={handleAuthentication}
        disabled={isLoading || !email || !email.includes("@")}
        className="w-full text-sm sm:w-auto"
      >
        {isLoading
          ? "Authenticating with Capsule..."
          : "Authenticate with Capsule"}
      </Button>
    </CardFooter>
  </>
);
