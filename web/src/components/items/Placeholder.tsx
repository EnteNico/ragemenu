import type { ItemProps } from '../../types';
import { replaceColors } from '../../utilts';

export function Placeholder({ item }: ItemProps) {
  return (
    <div
      className={`menu-content-item h-itemHeight flex justify-center items-center p-menuPadding`}
      dangerouslySetInnerHTML={{
        __html: replaceColors(item.name),
      }}
      style={
        {
          background: item.background && item.background,
        } as React.CSSProperties
      }
    />
  );
}
