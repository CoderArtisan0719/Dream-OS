import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function OrderConfirmation({
  handleContinue,
  handleCancel,
}: {
  handleContinue: () => void;
  handleCancel: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-[4px] pt-[9px]">
      <p className="mb-[21px] text-sm font-semibold text-white">
        Order Confirmation
      </p>
      <div className="space-y-3 text-sm font-semibold text-[#FFFFFF99]">
        <div className="flex justify-between">
          <p>Bridging</p>
          <span className="inline-flex items-center">
            <p>12 SOL</p>
            &nbsp;
            <Icon name="arrow-right-2" />
            &nbsp;
            <p>0.53 ETH</p>
          </span>
        </div>
        <div className="flex justify-between">
          <p>Price Impact</p>
          <p>5%</p>
        </div>
        <div className="flex justify-between">
          <p>ETA</p>
          <span className="inline-flex space-x-1 text-[#34C759]">
            <Icon name="thunder" className="size-4.5" />
            <p>Instant</p>
          </span>
        </div>
        <div className="flex justify-between">
          <p>Bridge Fee</p>
          <p>$5</p>
        </div>
        <div className="h-[1px] w-full bg-[#FFFFFF1A]" />
        <div className="flex justify-between text-white">
          <p>You Receive</p>
          <p>0.53 ETH</p>
        </div>
      </div>
      <div className="mt-auto flex space-x-[6.75px]">
        <Button
          onClick={handleCancel}
          className="h-[43px] flex-1 text-base"
          rounded="sm"
          size="lg"
        >
          Back
        </Button>
        <Button
          size="lg"
          variant="plain"
          onClick={handleContinue}
          rounded="sm"
          className="h-[43px] flex-1"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
