"use client";

import React, {
  ChangeEvent,
  TextareaHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { makeCxFunc, commaWithValue } from "@repo/rb-utils/parserUtils";

import style from "./TextArea.module.scss";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  maxLength?: number;
  error?: boolean;
  info?: boolean;
  handleChange?: (value: string, name?: string) => void;
}

const cx = makeCxFunc(style, 'rb-ui');

/**
 * 텍스트 입력 필드 컴포넌트
 */
const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { className = "", maxLength, error, handleChange, ...textareaProps },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [textCount, setTextCount] = useState(0);

    const onChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value, name } = e.target;

        handleChange?.(value, name);
        textareaProps.onChange?.(e);
        setTextCount(value.length);
      },
      [handleChange, textareaProps],
    );

    useEffect(() => {
      if (textareaRef.current) {
        setTextCount((textareaRef.current.value ?? "").length);
      }
    }, []);

    useEffect(() => {
      if (textareaRef.current && textareaRef.current.value.length > maxLength) {
        textareaRef.current.value = textareaRef.current.value.slice(
          0,
          maxLength,
        );
        dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, [maxLength]);

    useImperativeHandle(ref, () => textareaRef.current);

    return (
      <div className={cx(className, "text-area", { error })}>
        <textarea
          ref={textareaRef}
          {...textareaProps}
          maxLength={maxLength}
          onChange={onChange}
        ></textarea>
        {!!maxLength && (
          <p className={cx("text-count")}>
            <strong>{commaWithValue(textCount)}</strong>/
            {commaWithValue(maxLength)}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export type { Props as TextAreaProps };
export default TextArea;
