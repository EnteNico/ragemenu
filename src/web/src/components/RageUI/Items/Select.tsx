import { ChevronLeft } from '../../Chevron/ChevronLeft';
import { ChevronRight } from '../../Chevron/ChevronRight';

export const Select = ({ item, onChange }: any) => {
  return (
    <div className="rageui-item-select-container">
      <ChevronLeft onClick={() => onChange('left')} />
      {item.options.items[item.options.current]}
      <ChevronRight onClick={() => onChange('right')} />
    </div>
  );
};
