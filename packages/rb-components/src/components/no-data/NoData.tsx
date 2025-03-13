import React, { CSSProperties, ReactElement } from "react";

import { makeCxFunc } from "@repo/rb-utils/parserUtils";

import style from "./NoData.module.scss";

const cx = makeCxFunc(style, 'rb-ui');

interface PropsType {
  /**
   * 데이터가 없을때 노출시킬 메세지 내용
   */
  nullText?: ReactElement | string;
  style?: CSSProperties;
  className?: string;
  /**
   * 데이터가 없을때 노출시킬 아이콘 및 추가 내용
   */
  children?: ReactElement;
}

const NoData = ({
  className,
  nullText = "no data",
  children,
  style,
}: PropsType) => {
  return (
    <div className={cx("no-data", className)} style={style}>
      <span className={cx("no-data-icon")}>{children}</span>
      <p className={cx("no-data-text")}>{nullText}</p>
    </div>
  );
};

export type { PropsType as NoDataProps };
export default NoData;
