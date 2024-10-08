"use client";

import { useState } from "react";
import Capsule, { Environment, CapsuleModal } from "@usecapsule/react-sdk";
// Import styles if using v3.5.0 or greater of `@usecapsule/react-sdk`
import "@usecapsule/react-sdk/styles.css";

// const CAPSULE_API_KEY = process.env.CAPSULE_API_KEY;
const CAPSULE_API_KEY = "9a82eedf89ad62ed35e4cc0df4685630";

const capsule = new Capsule(Environment.BETA, CAPSULE_API_KEY);

export function CapsuleLogin() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <a
        onClick={() => {
          console.log("opening");
          setIsOpen(true);
        }}
      >
        Sign in With Email
      </a>

      <CapsuleModal
        capsule={capsule}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
