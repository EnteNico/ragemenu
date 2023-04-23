import Colors from '../../../data/colors';
import { ChevronLeft } from '../../Chevron/ChevronLeft';
import { ChevronRight } from '../../Chevron/ChevronRight';

export const ColorPanel = ({ currentMenu, activeItem }: any) => {
  return (
    <div className="rageui-color-panel">
      <div className="rageui-color-panel-header">
        <div className="rageui-color-panel-header-item">
          <ChevronLeft />
        </div>
        <div className="rageui-color-panel-header-item">
          <span>
            {currentMenu.items[activeItem].label} (
            {currentMenu.items[activeItem].options.current}/{Colors.length})
          </span>
        </div>
        <div className="rageui-color-panel-header-item">
          <ChevronRight />
        </div>
      </div>
      <div className="rageui-color-container">
        <div
          className="rageui-colors"
          style={
            {
              '--currentItem': `${currentMenu.items[activeItem].options.current}`,
              transform: `translateX(-${
                (currentMenu.items[activeItem].options.current - 1) * 4
              }vh)`,
            } as React.CSSProperties
          }>
          {Colors.map((color: any, index: number) => (
            <div
              className={`rageui-color ${
                currentMenu.items[activeItem].options.current - 1 === index
                  ? 'active'
                  : ''
              }`}
              key={index}
              style={{
                backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
