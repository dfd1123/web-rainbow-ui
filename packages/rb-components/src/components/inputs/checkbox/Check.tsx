"use client";

import React from "react";

import { makeCxFunc } from "@repo/rb-utils/parserUtils";

import CheckBox, { CheckBoxProps } from "./CheckBox";

import style from "./Check.module.scss";

type Props = Omit<
  CheckBoxProps,
  "value" | "checkValue" | "unCheckValue" | "partialValue" | "handleChange"
> & {
  value?: boolean;
  handleChange?: (value: boolean, name?: string) => void;
};

const cx = makeCxFunc(style, 'rb-ui');

/**
 * `Check` 컴포넌트는 사용자로부터 체크박스 형태의 입력을 받기 위한 UI 컴포넌트로써 낮은 위계로 활성화 여부를 제어할 때 사용합니다.<br />
 * 파란색 점선 영역은 Interaction 범위입니다.
 */
const Check = ({ className = "", handleChange, ...checkBoxProps }: Props) => {
  //logic

  return (
    <CheckBox
      className={cx(className, "check-single")}
      {...checkBoxProps}
      checkValue={true}
      unCheckValue={false}
      handleChange={handleChange}
    />
  );
};

Check.displayName = "Check";

export type { Props as CheckProps };
export default Check;
