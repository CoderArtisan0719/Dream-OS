import { RefObject, useEffect, useRef } from "react";
import { createPopper, Placement } from "@popperjs/core";

export default function usePopper(
  triggerRef: RefObject<HTMLElement> | null,
  popupRef: RefObject<HTMLElement> | null,
  {
    placement = "bottom-start",
    strategy = "absolute",
  }: {
    placement?: Placement;
    strategy: "fixed" | "absolute";
  },
  dependencies: any[],
) {
  const popperInstance = useRef<any>(null);
  useEffect(() => {
    if (!triggerRef?.current || !popupRef?.current) return;
    popperInstance.current = createPopper(
      triggerRef.current,
      popupRef.current,
      { placement, strategy },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRef, popupRef]);

  useEffect(() => {
    setTimeout(() => {
      popperInstance.current?.update?.();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
