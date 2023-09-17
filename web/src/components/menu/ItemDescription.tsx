import { replaceColors } from '../../utilts';

export function ItemDescription({ text }: { text: string }) {
  return (
    <div className="menu-item-description min-h-itemHeight mt-0.5 flex justify-between gradient-img">
      <div
        className="menu-item-description-text p-menuPadding"
        dangerouslySetInnerHTML={{
          __html: replaceColors(text),
        }}></div>
      <div className="menu-item-description-img top-0 p-3">
        <img
          src="assets/icons/info_icon_32.png"
          alt=""
        />
      </div>
    </div>
  );
}
