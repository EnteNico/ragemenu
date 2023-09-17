import useKeyPress from '../../hooks/useKeyPress';
import type { ItemProps } from '../../types';
import { replaceColors } from '../../utilts';

export function Slider({
  item,
  selected,
  selectedItem,
  menuContext,
}: ItemProps) {
  if (!selectedItem) return null;
  const selectedClass = selected && 'selected text-selected';

  const getValue = (value: number, step: number, type: 'add' | 'sub') => {
    if (type === 'add') {
      return value + step >= 100 ? 100 : value + step;
    } else {
      return value - step <= 0 ? 0 : value - step;
    }
  };

  const handleRight = () => {
    if (selectedItem.uuid !== item.uuid) return;
    menuContext.updateItem(selectedItem, {
      ...selectedItem,
      other: {
        ...selectedItem.other,
        value: getValue(
          selectedItem.other.value,
          selectedItem.other.step,
          'add'
        ),
      },
    });
  };

  const handleLeft = () => {
    if (selectedItem.uuid !== item.uuid) return;
    menuContext.updateItem(selectedItem, {
      ...selectedItem,
      other: {
        ...selectedItem.other,
        value: getValue(
          selectedItem.other.value,
          selectedItem.other.step,
          'sub'
        ),
      },
    });
  };

  useKeyPress('LEFT', handleLeft);
  useKeyPress('RIGHT', handleRight);

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
      <div className="menu-slider">
        <div
          className="item-slider"
          style={{ width: `${item.other.value}%` }}></div>
      </div>
    </div>
  );
}
