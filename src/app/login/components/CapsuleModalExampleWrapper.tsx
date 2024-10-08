import React from "react";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Switch,
} from "./core";
// import { HexColorPicker } from "react-colorful";
// import { PaletteIcon } from "lucide-react";

interface CapsuleModalExampleWrapperProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  foregroundColor: string;
  setForegroundColor: (color: string) => void;
  disableEmailLogin: boolean;
  setDisableEmailLogin: (checked: boolean) => void;
  disablePhoneLogin: boolean;
  setDisablePhoneLogin: (checked: boolean) => void;
  handleModalClose: () => void;
  handleModalOpen: () => void;
  onCancel: () => void;
  isCapsuleModalOpen: boolean;
  children: React.ReactNode;
}

export const CapsuleModalExampleWrapper: React.FC<
  CapsuleModalExampleWrapperProps
> = ({
  backgroundColor,
  setBackgroundColor,
  foregroundColor,
  setForegroundColor,
  disableEmailLogin,
  setDisableEmailLogin,
  disablePhoneLogin,
  setDisablePhoneLogin,
  handleModalClose,
  handleModalOpen,
  onCancel,
  isCapsuleModalOpen,
  children,
}) => (
  <>
    <CardHeader>
      <h2 className="text-xl font-bold">
        Capsule SDK: React Modal Authentication
      </h2>
      <p className="text-sm text-muted-foreground">
        Learn how to implement and customize Capsule&apos;s React Modal for
        authentication. This example demonstrates various configuration options
        available with the Capsule SDK.
      </p>
    </CardHeader>
    <CardContent className="flex flex-grow flex-col items-start overflow-auto">
      <Label className="mb-2 text-base font-semibold">
        Customize Capsule Modal Appearance:
      </Label>
      <Popover>
        <PopoverTrigger>
          <Button
            // variant="outline"
            className="mb-4"
            style={{ backgroundColor: backgroundColor }}
          >
            {/* <PaletteIcon className="mr-2 h-4 w-4" /> */}
            <span>Set Capsule Modal Background</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* <HexColorPicker
            color={backgroundColor}
            onChange={setBackgroundColor}
          /> */}
          <div>hex picker here</div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <Button
            // variant="outline"
            className="mb-4"
            style={{ backgroundColor: foregroundColor }}
          >
            {/* <PaletteIcon className="mr-2 h-4 w-4" /> */}
            <span>Set Capsule Modal Foreground</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* <HexColorPicker
            color={foregroundColor}
            onChange={setForegroundColor}
          /> */}
        </PopoverContent>
      </Popover>
      <Label className="mb-2 text-base font-semibold">
        Configure Capsule Authentication Options:
      </Label>
      <div className="mb-2 flex w-full justify-between space-x-2">
        <Label htmlFor="capsule-disable-email-login" className="text-base">
          Disable Capsule Email Login
        </Label>
        <Switch
          id="capsule-disable-email-login"
          checked={disableEmailLogin}
          onCheckedChange={setDisableEmailLogin}
        />
      </div>
      <div className="flex w-full justify-between space-x-2">
        <Label htmlFor="capsule-disable-phone-login" className="text-base">
          Disable Capsule Phone Login
        </Label>
        <Switch
          id="capsule-disable-phone-login"
          checked={disablePhoneLogin}
          onCheckedChange={setDisablePhoneLogin}
        />
      </div>
      {children}
    </CardContent>
    <CardFooter className="flex flex-col justify-between gap-2 p-4 sm:flex-row">
      <Button
        // variant="outline"
        onClick={onCancel}
        className="w-full text-sm sm:w-auto"
      >
        Back to Options
      </Button>
      <Button onClick={handleModalOpen} className="w-full text-sm sm:w-auto">
        Open Capsule Modal
      </Button>
    </CardFooter>
  </>
);
