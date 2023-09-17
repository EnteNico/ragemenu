import type { ItemProps } from '../../types';
import { replaceColors } from '../../utilts';
import useKeyPress from '../../hooks/useKeyPress';

export function Checkbox({
  item,
  selected,
  selectedItem,
  menuContext,
}: ItemProps) {
  const selectedClass = selected && 'selected text-selected';
  if (!selectedItem) return null;

  const handleEnter = () => {
    if (selectedItem.uuid !== item.uuid) return;
    menuContext.updateItem(selectedItem, {
      ...selectedItem,
      other: { checked: !selectedItem.other.checked },
    });
  };

  useKeyPress('ENTER', handleEnter);

  return (
    <div
      className={`menu-content-item h-itemHeight flex justify-between items-center p-menuPadding ${selectedClass}`}
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
      <div className="menu-checkbox">
        <img
          src={`assets/icons/commonmenu/${
            item.other.checked ? 'shop_box_tick.png' : 'shop_box_blank.png'
          }`}
        />
      </div>
    </div>
  );
}
