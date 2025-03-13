import React, { HTMLAttributes, ReactNode, createElement } from "react";

import { makeCxFunc } from "@repo/rb-utils/parserUtils";


import style from "./Typography.module.scss";
import { TypographyColorType, TypographyType } from "./constant";



interface TypographyProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  /** 태그 타입 */
  tag?: "h" | "p" | "span" | "font" | "label";
  /** h 태그의 레벨 */
  hLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 텍스트 스타일 */
  type?: TypographyType;
  /** 텍스트 색상 */
  color?: TypographyColorType;
  /** 컴포넌트 자식 노드 */
  children: ReactNode;
}

type TypographyHProps = Omit<TypographyProps, "tag">;
type TypographyPProps = Omit<TypographyProps, "tag" | "hLevel">;
type TypographySpanProps = Omit<TypographyProps, "tag" | "hLevel">;
type TypographyFontProps = Omit<TypographyProps, "tag" | "hLevel">;
type TypographyLabelProps = Omit<TypographyProps, "tag" | "hLevel">;

const cx = makeCxFunc(style, 'rb-ui');

/**
 * `Typography` 컴포넌트는 텍스트 스타일을 적용하기 위한 컴포넌트입니다.
 */
const Typography = ({
  className,
  tag = "span",
  hLevel = 1,
  type,
  color,
  children,
}: TypographyProps) => {
  //logic

  return createElement(
    tag === "h" ? `${tag}${hLevel}` : tag,
    {
      className: cx("typography", className, type),
      style: {
        color: color ? `var(--rb-${color})` : undefined,
      },
    },
    children,
  );
};

const H = (props: TypographyHProps) => <Typography {...props} tag="h" />;
const P = (props: TypographyPProps) => <Typography {...props} tag="p" />;
const Span = (props: TypographySpanProps) => (
  <Typography {...props} tag="span" />
);
const Font = (props: TypographyFontProps) => (
  <Typography {...props} tag="font" />
);
const Label = (props: TypographyLabelProps) => (
  <Typography {...props} tag="label" />
);

export { H, P, Span, Font, Label, Typography };

export type {
  TypographyProps,
  TypographyHProps,
  TypographyPProps,
  TypographySpanProps,
  TypographyFontProps,
  TypographyLabelProps,
};

export default Typography;
