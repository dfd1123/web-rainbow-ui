"use client";

import React, {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { makeCxFunc } from "@repo/rb-utils/parserUtils";

import style from "./RadioBox.module.scss";

interface PropsType
  extends Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "onChange" | "onBlur" | "onFocus"
  > {
  className?: string;
  /** 라디오박스 UI 옆에 나올 텍스트 및 React 엘리먼트 */
  children?: ReactNode | string;
  /** input 태그가 갖는 checkValue 값 */
  checkValue?: string | number;
  /** 바인딩할 데이터 값
   *
   * (`string | number`로 받아야함)
   */
  value?: string | number;
  size?: "normal" | "small";
  /** 체크박스가 비활성화 상태인지 여부 */
  disabled?: boolean;
  /** 체크박스가 읽기 전용 상태인지 여부 */
  readOnly?: boolean;
  /** 값이 변경될 때 호출될 함수
   *
   * (체크 상태에 따라 다른 값을 전달) */
  handleChange?: (value: AllowAny, name: string) => void;
}

const cx = makeCxFunc(style, 'rb-ui');

/**
 * RadioBox 컴포넌트는 라디오 버튼을 구현합니다. HTML `<input type="radio">` 요소의 특성을 확장하여
 * React에서 사용하기 쉽도록 만든 컴포넌트입니다.
 */
const RadioBox = forwardRef<HTMLInputElement, PropsType>(
  (
    {
      className = "",
      children,
      size = "normal",
      checkValue,
      value,
      handleChange,
      ...inputProps
    },
    ref,
  ) => {
    const inpRef = useRef<HTMLInputElement>(null);

    /**
     * input 태그에 전달할 checked 상태 값
     */
    const checked = useMemo(() => {
      // 전달된 value 가 없으면 input 태그의 checked 상태를 따르기 위해 undefined 반환
      if (!value) {
        return;
      }

      return value === checkValue;
    }, [value, checkValue]);

    /**
     * input 태그에 onChange가 트리거 될때 실행되는 함수
     */
    const handleValueChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value: targetValue } = e.target;

        // 전달된 checkValue 값과 targetValue가 같을때
        if (
          typeof checkValue === "number"
            ? Number(targetValue) === checkValue
            : targetValue === checkValue
        ) {
          handleChange(checkValue, name);
        }

        inputProps.onChange?.(e);
      },
      [handleChange, inputProps, checkValue],
    );

    // 해당 컴포넌트에 ref값이 전달된 경우 ref값에 inpRef.current (HTMLInputElement)가 세팅 될 수 있도록 설정
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inpRef.current,
    );

    return (
      <div
        className={cx("radio-box", className, size, {
          readonly: inputProps?.readOnly,
          disabled: inputProps?.disabled,
          "not-allow": inputProps?.readOnly || inputProps?.disabled,
          checked,
        })}
      >
        <label>
          <input
            ref={inpRef}
            {...inputProps}
            type="radio"
            value={checkValue}
            checked={checked}
            onChange={handleValueChange}
          />
          <span className={cx("ico-check")}>
            <i className={cx("icon")} />
          </span>
          <span className={cx("text")}>{children}</span>
        </label>
      </div>
    );
  },
);

RadioBox.displayName = "RadioBox";

export type { PropsType as RadioBoxProps };
export default RadioBox;
