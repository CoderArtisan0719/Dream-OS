import { FC, SVGProps } from "react";

export const Spinner: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="31"
    height="31"
    viewBox="0 0 31 31"
    fill="none"
    {...props}
  >
    <path
      d="M15.5004 2.00008V6.50008M15.5004 24.5001V29.0001M5.95445 5.95414L9.13643 9.13612M21.8643 21.864L25.0464 25.0461M1.99994 15.5011H6.49994M24.4999 15.5011H28.9999M5.95445 25.0461L9.13643 21.864M21.8643 9.13612L25.0464 5.95414"
      stroke="#007AFF"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
