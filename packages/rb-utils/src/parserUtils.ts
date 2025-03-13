import clsx from "clsx";

/**
 * 123,000.12 형식의 string 값을 number 형식으로 변환
 * @param {string} value
 * @returns {number}
 */
export const commaStrToNumber = (value: string): number => {
  return Number(value.replace(/,/gi, ""));
};

/**
 * 123000.12 형식의 string | number 값을 seperator(,)를 붙혀 반환
 * @param {string | number} value
 * @returns {string}
 */
export const commaWithValue = (value: string | number): string => {
  value = String(value ?? 0);
  if (value.match(/[^0-9,.]/g)) return value;
  if (value) {
    const parts = value.split(".");
    parts[0] = (parts[0] ?? "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return "0";
};

/**
 * 콤마로 천단위 분리를 수행한 후 다시 두 부분을 합쳐 숫자 스트링을 반환하는 함수
 * @param arg 문자열로 들어온 숫자값
 * @returns {string} 화면에 렌더할 최종적인 숫자 스트링
 */
export const makeParts = (arg: string): [string, string | undefined] => {
  const parts = arg.split(".") as [string, string | undefined];
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts;
};

/**
 * classNames/bind 모듈을 같이 활용하여 컴포넌트별 uniq한 className과 global className을 같이 반환하는 함수
 *
 * 사용법은 classNames.bind 함수와 동일합니다.
 *
 * @param {{ readonly [key: string]: string }} style - *.module.scss를 import한 객체
 * @returns CSS className 결과물
 */
export const makeCxFunc = (
  style: { readonly [key: string]: string },
  globalClassName?: string,
) => {
  // const cx = classNames.bind(style);

  return (
    ...args: Array<string | number | boolean | undefined | Record<string, any>>
  ) => {
    const classNames = args.reduce((acc, cur, index) => {
      if (typeof cur === "string") {
        acc += `${cur} `;
        args[index] = style[cur];
      } else if (typeof cur === "object") {
        const newObj: Record<string, boolean> = {};

        acc += Object.entries(cur).reduce((names, [key, value]) => {
          if (style[key]) {
            newObj[style[key]] = !!value;
          }

          if (value) {
            names += ` ${key}`;
          }

          return names;
        }, "");

        args[index] = newObj;
      }

      return acc;
    }, "");

    let classNameString = `${classNames} ${clsx(args)}`;

    if (globalClassName) {
      classNameString += ` ${globalClassName}`;
      args.push(style[globalClassName]);
    }

    const arr = classNameString.trim().split(" ");

    const uniqueArr = arr.filter((element, index) => {
      return arr.indexOf(element) === index;
    });

    return uniqueArr.join(" ");
  };
};

export const cn = (
  ...args: Array<string | number | boolean | undefined | Record<string, any>>
) => {
  const classNames = args.reduce<string>((acc, cur) => {
    if (typeof cur === "string") {
      acc += ` ${cur}`;
    } else if (typeof cur === "object") {
      acc += Object.entries(cur ?? {}).reduce((names, [key, value]) => {
        if (value) {
          names += ` ${key}`;
        }

        return names;
      }, "");
    }

    return acc;
  }, "");

  return classNames;
};
