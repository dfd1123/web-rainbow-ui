import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import classNames from "classnames/bind";

import styles from "./rainbow-ui.module.scss";

const cx = classNames.bind(styles);

type RainbowUiContextType = {
  /** rainbow ui 현재 테마 */
  theme: "dark" | "light";
  setThemeData: (theme: "dark" | "light") => void;
};

type RainbowUiProviderProps = {
  /** rainbow ui 현재 테마 */
  theme?: "dark" | "light";
  children: React.ReactNode;
};

const initialValue: RainbowUiContextType = {
  theme: "light",
  setThemeData: (_) => {},
};

const RainbowUiContext = createContext<RainbowUiContextType>(initialValue);

const RainbowUiProvider = ({ children, theme }: RainbowUiProviderProps) => {
  const [themeData, setThemeData] = useState(theme ?? initialValue.theme);

  const value = useMemo(
    () => ({ ...initialValue, theme: themeData, setThemeData }),
    [themeData, setThemeData],
  );

  useEffect(() => {
    if (theme) {
      setThemeData(theme);
      document.body.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <RainbowUiContext.Provider value={value}>
      <div id="rainbow-ui" className={cx("rainbow-ui")}>
        {children}
      </div>
    </RainbowUiContext.Provider>
  );
};

const useRainbowUi = () => {
  return useContext(RainbowUiContext);
};

export type { RainbowUiContextType };
export { RainbowUiContext, useRainbowUi };
export default RainbowUiProvider;
