'use client';

import { makeCxFunc } from '@repo/rb-utils/parserUtils';
import {ListMap, TYPOGRAPHY_COLORS, TypographyH, TypographySpan, VStack, SEMANTIC_SHADOWS} from '@repo/rb-components';
import style from './Color.module.scss';

const cx = makeCxFunc(style);

export type listItemProps = {
  name?: string;
  value?: string;
};

const SEMANTIC_TYPOGRAPHY_COLORS = Object.values(TYPOGRAPHY_COLORS).reduce(
  (acc: Record<string, string[]>, cur) => {
    const [kind] = (cur as string).split('-');

    if(kind){
      acc[kind] = [...(acc[kind] || []), cur as string];
    }

    return acc;
  },
  {} as Record<string, string[]>
);

const Color = () => {
  console.log('test!!!');
  return (
    <VStack gap={32}>
      <VStack tag="article" rowGap={32} className={cx('palette')}>
        {Object.entries(SEMANTIC_TYPOGRAPHY_COLORS).map(([kind, colorVars]) => (
          <div key={kind}>
            <TypographyH type="text-20-bold" hLevel={2}>
              --rb-{kind}-
            </TypographyH>
            <TypographySpan type="text-14-regular">
              사용 예시: {`var(--rb-${colorVars[0]})`}
            </TypographySpan>
            <ul className={cx('palette-list')}>
              <ListMap list={colorVars}>
                {({ item }) => {
                  const [_, ...rest] = item.split('-');
                  const color = rest.join('-');

                  return (
                    <li key={item}>
                      <div
                        className={cx('color-box')}
                        style={{ backgroundColor: `var(--rb-${item})` }}
                      ></div>
                      <em>{color}</em>
                    </li>
                  );
                }}
              </ListMap>
            </ul>
          </div>
        ))}
      </VStack>
      <VStack gap={32}>
        {Object.values(SEMANTIC_SHADOWS as Record<string, string>).map((shadowVar) => (
          <VStack key={shadowVar} gap={16}>
            <VStack>
              <TypographyH type="text-16-bold" hLevel={2}>
                --rb-{shadowVar}-
              </TypographyH>
              <TypographySpan type="text-14-regular">
                사용 예시: {`var(--rb-${shadowVar})`}
              </TypographySpan>
            </VStack>
            <VStack gap={16}>
              <div
                className={cx('shadow-box')}
                style={{ boxShadow: `var(--rb-${shadowVar})` }}
              ></div>
              <TypographySpan type="text-16-regular">{shadowVar}</TypographySpan>
            </VStack>
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default Color;
