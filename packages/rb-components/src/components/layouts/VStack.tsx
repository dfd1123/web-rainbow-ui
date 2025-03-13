import { HTMLAttributes, CSSProperties, ReactNode, createElement } from "react";

import { makeCxFunc } from "@repo/rb-utils/parserUtils";

import style from "./Stack.module.scss";

interface PropsType extends HTMLAttributes<HTMLElement> {
  id?: string;
  /**
   * 컴포넌트 클래스명
   */
  className?: string;
  /**
   * 컴포넌트 태그
   */
  tag?:
    | "div"
    | "section"
    | "article"
    | "header"
    | "footer"
    | "main"
    | "aside"
    | "nav";
  /**
   * inline-flex 레이아웃 여부
   */
  inline?: boolean;
  /**
   * flex의 justify-content
   */
  justifyContent?: CSSProperties["justifyContent"];
  /**
   * flex의 justify-items
   */
  justifyItems?: CSSProperties["justifyItems"];
  /**
   * flex의 justify-self
   */
  justifySelf?: CSSProperties["justifySelf"];
  /**
   * flex의 align-items
   */
  alignItems?: CSSProperties["alignItems"];
  /**
   * flex의 align-self
   */
  alignSelf?: CSSProperties["alignSelf"];
  /**
   * flex의 align-content
   */
  alignContent?: CSSProperties["alignContent"];
  /**
   * flex의 gap
   */
  gap?: CSSProperties["gap"];
  /**
   * flex의 column-gap
   */
  columnGap?: CSSProperties["columnGap"];
  /**
   * flex의 row-gap
   */
  rowGap?: CSSProperties["rowGap"];
  /**
   * 컴포넌트 스타일
   */
  style?: Omit<CSSProperties, "columnGap" | "rowGap">;
  /**
   * 컴포넌트 자식 노드
   */
  children: ReactNode;
}

const cx = makeCxFunc(style, 'rb-ui');

/**
 * `VStack`은 display: flex; 형태의 수직 스택 컴포넌트 입니다.
 */
const VStack = ({
  id,
  className,
  inline,
  justifyContent,
  justifyItems,
  justifySelf,
  alignItems,
  alignSelf,
  alignContent,
  gap,
  columnGap,
  rowGap,
  style = {},
  children,
  tag = "div",
  ...rest
}: PropsType) => {
  const checkGapClassName = (
    directionGap: CSSProperties["columnGap"] | CSSProperties["rowGap"],
    gap?: CSSProperties["gap"],
  ) => {
    if (directionGap) {
      return (
        typeof directionGap === "number" &&
        directionGap > 0 &&
        directionGap <= 500
      );
    }

    return typeof gap === "number" && gap > 0 && gap <= 500;
  };

  return createElement(
    tag,
    {
      ...rest,
      id,
      className: cx("vstack", className, {
        "inline-flex": inline,
        flex: !inline,
        [`justify-content-${justifyContent}`]: justifyContent,
        [`justify-items-${justifyItems}`]: justifyItems,
        [`justify-self-${justifySelf}`]: justifySelf,
        [`align-items-${alignItems}`]: alignItems,
        [`align-self-${alignSelf}`]: alignSelf,
        [`align-content-${alignContent}`]: alignContent,
        [`column-gap-${columnGap ?? gap}`]: checkGapClassName(columnGap, gap),
        [`row-gap-${rowGap ?? gap}`]: checkGapClassName(rowGap, gap),
      }),
      style: {
        ...style,
        gap: !checkGapClassName(gap) && gap,
        columnGap: !checkGapClassName(columnGap) && columnGap,
        rowGap: !checkGapClassName(rowGap) && rowGap,
      },
    },
    children,
  );
};

export type { PropsType as VStackProps };
export default VStack;
