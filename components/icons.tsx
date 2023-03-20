// icon:refresh-circle-outline | Ionicons https://ionicons.com/ | Ionic Framework
import * as React from "react";
import { useState } from "react";

function IconRefreshCircleOutline(
  props: React.SVGProps<SVGSVGElement> & { size?: number }
) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={28}
        d="M288 193s12.18-6-32-6a80 80 0 1080 80"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={28}
        d="M256 149l40 40-40 40"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
      />
    </svg>
  );
}

export default IconRefreshCircleOutline;
