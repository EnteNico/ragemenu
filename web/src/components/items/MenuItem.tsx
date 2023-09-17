import { useContext } from 'react';
import { MenuContext } from '../App';
import { replaceColors } from '../../utilts';
import { Placeholder } from './Placeholder';
import { Checkbox } from './Checkbox';
import { List } from './List';
import { Slider } from './Slider';
import type { ItemProps } from '../../types';

const typeComponents: Record<string, React.FC<any>> = {
  placeholder: Placeholder,
  checkbox: Checkbox,
  list: List,
  slider: Slider,
};

export function MenuItem({ selected, selectedItem, item }: ItemProps) {
  const selectedClass = selected && 'selected text-selected';
  const disabledClass = item.disabled && 'disabled';
  const isDisabled = item.disabled !== undefined && item.disabled;
  const menuContext = useContext(MenuContext);

  if (item.type in typeComponents) {
    const Component = typeComponents[item.type];
    return (
      <Component
        key={item.uuid}
        item={item}
        selected={selected}
        selectedItem={selectedItem}
        menuContext={menuContext}
      />
    );
  }

  return (
    <div
      className={`menu-content-item h-itemHeight flex justify-between items-center p-menuPadding ${selectedClass} ${disabledClass}`}
      style={
        {
          background: item.background && item.background,
        } as React.CSSProperties
      }>
      <div
        dangerouslySetInnerHTML={{
          __html: replaceColors(item.name),
        }}
      />
      {!isDisabled && item.rightLabel && (
        <div
          className="menu-content-item-right-label"
          dangerouslySetInnerHTML={{
            __html: replaceColors(item.rightLabel),
          }}
        />
      )}
      {!isDisabled && item.submenu && (
        <div className="menu-content-item-right-label">
          <img src="assets/icons/submenu_arrow.png" />
        </div>
      )}
      {isDisabled && (
        <div className="menu-content-item-right-label disabled">
          <img src="assets/icons/commonmenu/shop_lock.png" />
        </div>
      )}
    </div>
  );
}
