import usePopper from "@/utils/hooks/usePopper";
import { cn } from "@/utils/tailwind";
import { Placement } from "@popperjs/core";
import { useRef, useState } from "react";

export function Tooltip(props: {
  children: React.ReactNode;
  placement?: Placement;
  label: string | React.ReactNode;
}) {
  const { children, label, placement = "auto" } = props;
  const [visible, setVisibility] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<any>(null);

  usePopper(triggerRef, tooltipRef, { placement, strategy: "fixed" }, [
    visible,
  ]);

  return (
    <div
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
      className="relative z-[4]"
    >
      <div ref={triggerRef}>{children}</div>
      <div
        ref={tooltipRef}
        className={cn(
          "absolute max-w-[250px] whitespace-break-spaces rounded-[5px] bg-[#191919] p-2 text-xxxs",
          { "pointer-events-none invisible": !visible },
        )}
      >
        {label}
      </div>
    </div>
  );
}
