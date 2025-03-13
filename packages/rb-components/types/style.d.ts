import { CSSProperties } from "react";

export type CustomCSSProperties = CSSProperties &
  Record<string, string | number | null | undefined>;
