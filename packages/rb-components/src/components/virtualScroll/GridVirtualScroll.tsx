"use client";

import React, {
  CSSProperties,
  RefObject,
  ReactElement,
  cloneElement,
  createElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { makeCxFunc } from "@repo/rb-utils/parserUtils";
import { UnknownArrayType, GetArrayItemType } from "types/utility";

import imageCacher from "./imageCacher";
import Spinner from "../loadings/Spinner";
import NoData from "../no-data/NoData";

import style from "./VirtualScroll.module.scss";

if (typeof window === "undefined") React.useLayoutEffect = React.useEffect;

interface Props<LIST extends UnknownArrayType> {
  className?: string;
  /** scroll의 주체가 되는 element를 ref로 전달하거나 HTMLElement로 전달 (default: window) */
  scrollTarget?: RefObject<HTMLElement | null> | HTMLElement;
  /** 랜더링 할 list 배열 */
  list: LIST | null;
  /** viewport에 노출되는 리스트 말고 container 위 아래에 미리 랜더링을 해놓을 열의 갯수 (default: 2) */
  preloadRowCnt?: number;
  /** list의 요소 하나에 대한 width (함수로 전달하여 동적으로 계산 가능) */
  itemWidth: number | ((containerWidth: number) => number);
  /** list의 요소 하나에 대한 height (함수로 전달하여 동적으로 계산 가능) */
  itemHeight: number | ((containerWidth: number) => number);
  /** x좌표를 기준으로 list의 각 요소 간의 간격 (함수로 전달하여 동적으로 계산 가능) */
  gapX: number | ((containerWidth: number) => number);
  /** y좌표를 기준으로 list의 각 요소 간의 간격 (함수로 전달하여 동적으로 계산 가능) */
  gapY: number | ((containerWidth: number) => number);
  /** list가 빈배열일때 데이터가 없는 것으로 간주하고 노출할 데이터가 없음을 나타내는 내용 */
  noDataMsg?: string | ReactElement;
  /** loading 상태 여부 */
  loading?: boolean;
  /** list가 null이거나 loading이 true면 list 데이터를 fetch 하고 있는 것으로 간주하고 노출할 로딩 요소/컴포넌트 */
  loadingElement?: string | ReactElement;
  /** 로딩시 스켈레톤 처리를 하고 싶을때 보여줄 스켈레톤 요소/컴포넌트 */
  skeletonElement?: ReactElement;
  /** 로딩시 스켈레톤 처리 할때 보여줄 스켈레톤 요소 갯수 */
  skeletonCnt?: number;
  /**
   * list의 각 요소의 element를 그릴때 사용할 함수 (랜더링 하고자 하는 컴포넌트 및 jsx 형태를 반환하면 됨)
   *
   * 인자로 { item, imageCacher, index } 객체가 전달되는데
   * item - list의 요소
   * index - list index
   * imageCacher - 랜더할 컴포넌트가 갖고 있는 이미지 src를 인자로 전달하면 해당 이미지를 캐시 처리하는 함수
   *  */
  element: ({
    item,
    imageCacher,
    index,
  }: {
    item: GetArrayItemType<LIST>;
    imageCacher: (imgSrcList: string | string[]) => void;
    index: number;
  }) => ReactElement;
}

type VirtualItemProps = {
  width?: number;
  gapX?: number;
  gapY?: number;
  rowIndex?: number;
  columnIndex?: number;
  startIndex?: number;
  children?: ReactElement;
};

const cx = makeCxFunc(style, 'rb-ui');

const VirtualItem = memo(
  ({
    width,
    gapX,
    gapY,
    rowIndex,
    columnIndex,
    startIndex,
    children,
  }: VirtualItemProps) => {
    const [item, setItem] = useState<HTMLDivElement>();

    const [style, setStyle] = useState<CSSProperties>({
      position: "absolute",
      width,
      top: (item?.offsetHeight ?? 0 + gapY) * (startIndex + columnIndex),
      left: !rowIndex ? 0 : (width + gapX) * rowIndex,
      zIndex: 1,
    });

    const getElementStyle = useCallback(() => {
      if (item) {
        const height = item.offsetHeight;

        setStyle((style) => ({
          ...style,
          width,
          left: !rowIndex ? 0 : (width + gapX) * rowIndex,
          top: (height + gapY) * (startIndex + columnIndex),
          visibility: "visible",
        }));
      }
    }, [item, width, rowIndex, gapX, gapY, startIndex, columnIndex]);

    React.useLayoutEffect(() => {
      getElementStyle();
    }, [getElementStyle]);

    return (
      <div ref={setItem} className={cx("virtual-item")} style={style}>
        {children}
      </div>
    );
  },
);

VirtualItem.displayName = "VirtualItem";

/**
 * GridVirtualScroll 컴포넌트는 가상 스크롤을 이용하여 대량의 데이터를 효율적으로 렌더링하는 그리드 형태의 UI를 제공합니다.
 * 이 컴포넌트는 성능 최적화를 위해 화면에 보이는 부분만 렌더링하며, 사용자가 스크롤할 때 추가적인 데이터를 동적으로 로드합니다.
 */
const GridVirtualScroll = <LIST extends UnknownArrayType>({
  list,
  className = "",
  scrollTarget,
  preloadRowCnt = 2,
  itemWidth,
  itemHeight,
  gapX,
  gapY,
  loading,
  loadingElement = <Spinner />,
  skeletonElement,
  skeletonCnt = 3,
  noDataMsg,
  element,
}: Props<LIST>) => {
  const vsRef = useRef<HTMLDivElement>(null);
  const scrollHandlerRef = useRef<number | null>(null);
  const maxHeightRef = useRef(0);
  const offsetTop = useRef(0);
  const prevRenderTime = useRef(0);
  const prevScrollPos = useRef(0);
  const indexInfoRef = useRef({
    startIndex: 0,
    endIndex: 10,
  });

  const [isKeepStatus] = useState(!!list);
  const [indexInfo, setIndexInfo] = useState({
    startIndex: 0,
    endIndex: 10,
  });
  const [sizeInfo, setSizeInfo] = useState({
    containerWidth: vsRef.current?.clientWidth ?? 0,
    width:
      typeof itemWidth === "number"
        ? itemWidth
        : itemWidth(vsRef.current?.clientWidth ?? 0),
    gapX:
      typeof gapX === "number" ? gapX : gapX(vsRef.current?.clientWidth ?? 0),
    gapY:
      typeof gapY === "number" ? gapY : gapY(vsRef.current?.clientWidth ?? 0),
  });

  const resizeObserver = useMemo(() => {
    if (typeof window === "undefined") {
      return;
    }

    return new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { clientWidth } = entry.target;

        setSizeInfo({
          containerWidth: clientWidth ?? 0,
          width:
            typeof itemWidth === "number"
              ? itemWidth
              : itemWidth(clientWidth ?? 0),
          gapX: typeof gapX === "number" ? gapX : gapX(clientWidth ?? 0),
          gapY: typeof gapY === "number" ? gapY : gapY(clientWidth ?? 0),
        });
      }
    });
  }, [gapX, gapY, itemWidth]);

  const isLoading = useMemo(() => {
    return loading || !list;
  }, [loading, list]);

  const gridList = useMemo(() => {
    const makeGridList = <T extends AllowAny[]>(arr: T) => {
      const { containerWidth, width } = sizeInfo;

      const rowCnt = parseInt((containerWidth / width).toString());
      const numCols = Math.ceil(arr.length / rowCnt) || 0;

      const result = new Array(numCols) as GetArrayItemType<T>[][];

      for (let columnIndex = 0; columnIndex < numCols; columnIndex++) {
        result[columnIndex] = arr
          .slice(columnIndex * rowCnt, (columnIndex + 1) * rowCnt)
          .map((item) => item);
      }

      return result;
    };
    const skeletonList = Array.from({ length: skeletonCnt }).map(
      (): undefined => undefined
    );

    return makeGridList(isLoading ? skeletonList : list);
  }, [list, isLoading, sizeInfo, skeletonCnt]);

  const renderList = useMemo(() => {
    return gridList.slice(indexInfo.startIndex, indexInfo.endIndex);
  }, [indexInfo, gridList]);

  const maxHeight = useMemo(() => {
    const idealHeight =
      typeof itemHeight === "number"
        ? itemHeight
        : itemHeight(sizeInfo.containerWidth);
    if (vsRef.current) {
      const children = Array.from(vsRef.current.children) as HTMLElement[];

      if (children.length) vsRef.current.style.minHeight = "";

      const result =
        Math.max(
          ...children.map((item) => {
            return (item.offsetHeight ?? 0) + sizeInfo.gapY;
          }),
          0,
        ) ||
        idealHeight ||
        0;

      maxHeightRef.current = result;

      return result;
    }

    return idealHeight || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridList, renderList, sizeInfo, itemHeight]);

  const containerHeight = useMemo(() => {
    if (!list && !skeletonElement) return;

    return maxHeight > 0 ? gridList.length * maxHeight : 0;
  }, [list, skeletonElement, maxHeight, gridList.length]);

  /** 총 list들 중 화면에 render되어야 할 list를 추출하기 위해 필요한 값인 startIndex와 endIndex를 계산하는 함수 */
  const caculateIndexInfo = useCallback(() => {
    const scrollEl = scrollTarget
      ? "current" in scrollTarget
        ? scrollTarget.current
        : scrollTarget
      : null;

    const scrollY = scrollEl ? scrollEl.scrollTop : window.scrollY;
    const wrapHeight = scrollEl ? scrollEl.offsetHeight : window.innerHeight;
    const scrollHeight = scrollEl
      ? scrollEl.scrollHeight
      : document.body.scrollHeight;

    const newStartIndex =
      offsetTop.current > scrollY
        ? 0
        : Math.floor((scrollY - offsetTop.current) / maxHeight) - preloadRowCnt;
    const newEndIndex =
      Math.ceil((scrollY + wrapHeight) / maxHeight) + preloadRowCnt;

    if (scrollHeight === scrollY + wrapHeight) {
      return {
        startIndex: indexInfoRef.current.startIndex,
        endIndex: indexInfoRef.current.endIndex,
      };
    }

    return {
      startIndex: !!maxHeight && newStartIndex >= 0 ? newStartIndex : 0,
      endIndex: !maxHeight || !newEndIndex ? 10 : newEndIndex,
    };
  }, [maxHeight, preloadRowCnt, scrollTarget]);

  const handleScroll = useCallback(() => {
    const scrollEl = scrollTarget
      ? "current" in scrollTarget
        ? scrollTarget.current
        : scrollTarget
      : null;

    const scrollY = scrollEl ? scrollEl.scrollTop : window.scrollY;
    const currentTime = Date.now();
    const scrollDiff = scrollY - prevScrollPos.current;
    const isScrollDown = scrollDiff > 0;
    const scrollDiffAbs = isScrollDown ? scrollDiff : scrollDiff * -1;

    if (scrollHandlerRef.current !== null) {
      cancelAnimationFrame(scrollHandlerRef.current);
    }

    scrollHandlerRef.current = requestAnimationFrame(() => {
      const indexInfo = caculateIndexInfo();

      if (
        scrollDiffAbs > 0 &&
        scrollY > 0 &&
        ((isScrollDown && indexInfo.endIndex < indexInfoRef.current.endIndex) ||
          (!isScrollDown &&
            indexInfo.startIndex > indexInfoRef.current.startIndex))
      ) {
        cancelAnimationFrame(scrollHandlerRef.current);
        scrollHandlerRef.current = null;

        return;
      }

      if (isScrollDown && scrollDiffAbs > maxHeight) {
        indexInfo.endIndex += Math.floor(scrollDiffAbs / maxHeight);
      } else if (!isScrollDown && scrollDiffAbs > maxHeight) {
        indexInfo.startIndex -= Math.floor(scrollDiffAbs / maxHeight);

        if (indexInfo.startIndex <= 0) {
          indexInfo.startIndex = 0;
        }
      }

      if (
        currentTime - prevRenderTime.current >= 200 ||
        scrollY <= 0 ||
        scrollDiffAbs === 0
      ) {
        setIndexInfo(indexInfo);

        prevScrollPos.current = scrollY;
        indexInfoRef.current = { ...indexInfo };
        prevRenderTime.current = currentTime;

        scrollHandlerRef.current = null;

        return;
      } else if (scrollDiffAbs >= maxHeight * (preloadRowCnt / 2)) {
        setIndexInfo(indexInfo);

        prevScrollPos.current = scrollY;
        prevRenderTime.current = currentTime;
        indexInfoRef.current = { ...indexInfo };

        scrollHandlerRef.current = null;

        return;
      } else if (
        indexInfoRef.current.endIndex - indexInfo.endIndex > preloadRowCnt ||
        indexInfo.startIndex - indexInfoRef.current.startIndex > preloadRowCnt
      ) {
        setIndexInfo(indexInfo);

        prevScrollPos.current = scrollY;
        prevRenderTime.current = currentTime;
        indexInfoRef.current = { ...indexInfo };
      }
    });
  }, [caculateIndexInfo, maxHeight, preloadRowCnt, scrollTarget]);

  useEffect(() => {
    if (resizeObserver) {
      const el = vsRef.current;
      resizeObserver.observe(el);

      return () => {
        if (el) {
          resizeObserver.unobserve(el);
        }
      };
    }
  }, [vsRef, resizeObserver]);

  useEffect(() => {
    if (vsRef.current) {
      const { top } = vsRef.current.getBoundingClientRect();
      offsetTop.current = window.scrollY + top;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && vsRef.current) {
      const eventTarget = scrollTarget
        ? "current" in scrollTarget
          ? scrollTarget.current
          : scrollTarget
        : window;

      handleScroll();

      eventTarget?.removeEventListener("scroll", handleScroll);
      eventTarget?.addEventListener("scroll", handleScroll);

      return () => {
        if (scrollHandlerRef.current !== null)
          cancelAnimationFrame(scrollHandlerRef.current);
        eventTarget?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [scrollTarget, scrollHandlerRef, handleScroll]);

  return (
    <div
      ref={vsRef}
      className={cx(className, "virtual-scroll", {
        "no-data": !!list && !list.length,
      })}
      style={{
        height: containerHeight,
        minHeight: isKeepStatus && !renderList.length ? "9999999px" : 0,
      }}
    >
      {isLoading && !skeletonElement && (
        <div className={cx("loading")}>{loadingElement}</div>
      )}
      {!isLoading &&
        list.length === 0 &&
        (typeof noDataMsg === "object" ? (
          noDataMsg
        ) : (
          <NoData className={cx("no-msg-comp")} nullText={noDataMsg} />
        ))}
      {renderList.map((rowList, columnIndex) =>
        rowList.map((item, rowIndex) => {
          const realIndex =
            (indexInfo.startIndex + columnIndex) * rowList.length + rowIndex;
          const renderIndex = columnIndex * rowList.length + rowIndex;

          return (
            <VirtualItem
              key={`${renderIndex}-${sizeInfo.containerWidth}${isLoading ? "skeleton" : ""}`}
              {...sizeInfo}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              startIndex={indexInfo.startIndex}
            >
              <div>
                {cloneElement(
                  !list
                    ? skeletonElement
                    : createElement(element, {
                        item: item as GetArrayItemType<LIST>,
                        imageCacher: imageCacher,
                        index: realIndex,
                      }),
                  {},
                )}
              </div>
            </VirtualItem>
          );
        }),
      )}
    </div>
  );
};

export type { Props as GridVirtualScrollProps };
export default memo(GridVirtualScroll) as typeof GridVirtualScroll;
