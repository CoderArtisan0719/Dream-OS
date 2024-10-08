"use client";

import {
  validationInitialState,
  ValidationStatus,
} from "@/app/api/v1/constants";
import { LogoBevel } from "@/app/assets/logoBevel";
import { createDreamId, validateDreamId } from "@/app/data/profiles/actions";
import { Button } from "@/components/ui/button";
import debounce from "lodash.debounce";
import { Check, Loader2, X } from "lucide-react";
import {
  Fragment,
  ReactNode,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";

export function ClaimCard() {
  const [dreamId, setDreamId] = useState("");
  const [debouncedDreamId, setDebouncedDreamId] = useState("");

  const [validationState, validateAction] = useActionState(
    validateDreamId,
    validationInitialState,
  );

  const [submitState, submitAction] = useActionState(createDreamId, {
    error: null,
  });

  // Debounce function
  const debouncedSetDreamId = useRef(
    debounce((value: string) => {
      setDebouncedDreamId(value);
    }, 300),
  ).current;

  useEffect(() => {
    debouncedSetDreamId(dreamId);

    return () => {
      debouncedSetDreamId.cancel();
    };
  }, [dreamId, debouncedSetDreamId]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("dreamId", debouncedDreamId);

    startTransition(() => {
      validateAction(formData);
    });
  }, [debouncedDreamId, validateAction]);

  const [validationPending, startTransition] = useTransition();

  return (
    <div className="mx-auto flex w-full max-w-96 flex-col items-center justify-center rounded-xl bg-neutral-300 p-2">
      <div className="relative flex h-56 w-full items-center justify-center rounded-2xl border border-black/10 bg-gradient-to-b from-[#e5e5e5] to-[#cccccc] shadow">
        <div className="absolute bottom-3 left-5 text-center text-[28px] leading-tight text-black/20">
          {dreamId}
        </div>

        <LogoBevel />
      </div>

      <div className="w-full">
        <form action={submitAction}>
          <div className="relative mt-6 flex w-full">
            <input
              id="dreamId"
              name="dreamId"
              className="h-12 flex-1 rounded-md px-4 text-lg font-medium tracking-wide placeholder:text-gray-300"
              onChange={(e) => {
                setDreamId(e.target.value);
              }}
              value={dreamId}
              placeholder="choose your dream ID"
            />
            {renderAvailableStatus(validationState.status, validationPending)}
          </div>
          {submitState.error && (
            <div className="mt-1 p-2 text-sm text-red-500">
              {submitState.error}
            </div>
          )}
          {validationState.error && (
            <div className="mt-1 p-2 text-sm text-red-500">
              {validationState.error}
            </div>
          )}
          <div className="mt-2 flex w-full">
            <SubmitButton validationStatus={validationState.status} />
          </div>
        </form>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <Fragment>
      <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-white">
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    </Fragment>
  );
}

function Available() {
  return (
    <Fragment>
      <span className="mr-2 text-available sm:text-sm">Available</span>
      <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-available text-white">
        <Check className="h-3 w-3" />
      </span>
    </Fragment>
  );
}

function Unavailable() {
  return (
    <Fragment>
      <span className="mr-2 text-red-500 sm:text-sm">Unavailable</span>
      <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
        <X className="h-3 w-3" />
      </span>
    </Fragment>
  );
}

function IconWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      {children}
    </div>
  );
}

function renderAvailableStatus(status: string, pending: boolean): ReactNode {
  if (pending) {
    return (
      <IconWrapper>
        <Loading />
      </IconWrapper>
    );
  }

  if (status === "available") {
    return (
      <IconWrapper>
        <Available />
      </IconWrapper>
    );
  }

  if (status === "unavailable") {
    return (
      <IconWrapper>
        <Unavailable />
      </IconWrapper>
    );
  }

  return null;
}

function SubmitButton({
  validationStatus,
}: {
  validationStatus: ValidationStatus;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      size="lg"
      className="flex flex-1 items-center justify-center text-base font-medium tracking-wide"
      type="submit"
      disabled={pending || validationStatus === "unavailable"}
    >
      {pending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-500" />
      )}
      Continue
    </Button>
  );
}
