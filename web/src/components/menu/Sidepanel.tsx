import { Sidepanel } from '../../types';

export function PanelSide({ sidepanel }: { sidepanel: Sidepanel }) {
  return (
    <div className="sidepanel w-menuWidth">
      <div
        className="relative menu-header h-sidepanelHeight"
        style={{
          background: `url('assets/banners/${
            (sidepanel.image && `${sidepanel.image}.png`) || 'default.png'
          }')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <div className="sidepanel-text absolute bottom-0 right-0 w-full h-10 text-end gradient-img">
          {sidepanel.title}
        </div>
      </div>
      <div className="sidepanel-content">
        {sidepanel.items.map((item, index) => (
          <div
            className="sidepanel-item flex justify-between items-center p-menuPadding"
            key={index}>
            <div>{item.leftLabel}</div>
            <div>{item.rightLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
