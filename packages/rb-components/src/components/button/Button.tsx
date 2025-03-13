"use client";

import React, {
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
  useCallback,
  useRef,
} from "react";

import { makeCxFunc } from "@repo/rb-utils/parserUtils";

import Spinner from "../loadings/Spinner";
import Ripple, { RippleOption } from "../ripple/Ripple";

import style from "./Button.module.scss";

interface PropsType extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  /** button 태그의 type */
  type?: "button" | "submit";
  /** button 요소 안에 랜더링될 내용 */
  children: ReactNode | string;
  /** button 사이즈 */
  size?: "large" | "medium" | "small";
  /** 버튼의 UI타입별로 컬러가 추가될 시 사용할 예정 */
  color?: "primary" | "secondary";
  /**
   * ripple 효과 option
   *
   * { color?: string; duration?: number; maxSize?: number; disabled?: boolean }
   */
  ripple?: RippleOption;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 더블 클릭 방지 여부 */
  detectDoubleClick?: boolean;
  /**
   * button을 loading 처리할지 여부
   *
   * `true`면 `Spinner` 컴포넌트 노출
   */
  loading?: boolean;
  /** button 태그를 클릭했을때 호출되는 함수 */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const cx = makeCxFunc(style, 'rb-ui');

/**
 * Button 컴포넌트는 다양한 버튼 관련 기능을 제공합니다. <br/>
 */
const Button = ({
  className = "",
  type = "button",
  children,
  size,
  color = "primary",
  ripple,
  detectDoubleClick,
  disabled,
  loading = false,
  onClick,
  ...buttonProps
}: PropsType) => {
  const clickTimeoutId = useRef<number>(null);

  const handleDetectDoubleClick = useCallback(() => {
    if (detectDoubleClick) {
      window.clearTimeout(clickTimeoutId.current ?? 0);

      clickTimeoutId.current = window.setTimeout(() => {
        clickTimeoutId.current = null;
      }, 500);
    }
  }, [detectDoubleClick]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (clickTimeoutId.current) {
        return;
      }

      onClick?.(e);

      handleDetectDoubleClick();
    },
    [handleDetectDoubleClick, onClick],
  );

  return (
    <Ripple {...ripple}>
      <button
        type={type}
        className={cx(className, size, color, "btn")}
        disabled={disabled}
        onClick={handleClick}
        {...buttonProps}
      >
        {loading ? <Spinner size={20} /> : children}
      </button>
    </Ripple>
  );
};

export type { PropsType as ButtonProps };
export default Button;
