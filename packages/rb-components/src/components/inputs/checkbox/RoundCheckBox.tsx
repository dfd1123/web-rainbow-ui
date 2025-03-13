"use client";

import React from "react";

import { makeCxFunc } from "@repo/rb-utils/parserUtils";

import CheckBox, { CheckBoxProps } from "./CheckBox";

import style from "./RoundCheckBox.module.scss";

type Props = CheckBoxProps & {
  // type
};

const cx = makeCxFunc(style);

const RoundCheckBox = ({ className = "", ...CheckBoxProps }: Props) => {
  //logic

  return (
    <CheckBox className={cx(className, "checkbox-round")} {...CheckBoxProps} />
  );
};

RoundCheckBox.displayName = "RoundCheckBox";
export type { Props as CheckBoxProps };
export default RoundCheckBox;
