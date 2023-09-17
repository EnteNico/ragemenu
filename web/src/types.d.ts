type ItemTypes = 'button' | 'checkbox' | 'list' | 'placeholder' | 'slider';
type MenuThemes = 'rageui' | 'test';

interface Menu {
  uuid: string;
  resource: string;
  title: string;
  subtitle: string;
  maxItems: number;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'center'
    | 'center-right'
    | 'center-left';
  banner?: string;
  theme?: MenuThemes;
  items: Item[];
}

interface Item {
  uuid: string;
  name: string;
  background?: string;
  description?: string;
  rightLabel?: string;
  type: ItemTypes;
  other?: any;
  sidepanel?: Sidepanel;
  disabled?: boolean;
  submenu?: string;
}

interface Sidepanel {
  title: string;
  image?: string;
  items: SidepanelItem[];
}

interface SidepanelItem {
  leftLabel: string;
  rightLabel: string;
}

interface ItemProps {
  selected: boolean;
  selectedItem?: Item;
  item: Item;
  menuContext: MenuContextProps;
}

interface MenuContextProps {
  updateItem: (oldItem: Item, newItem: Item) => void;
  updateMenu: (menu: Menu) => void;
}

export type {
  Menu,
  Item,
  Sidepanel,
  SidepanelItem,
  ItemProps,
  MenuContextProps,
};
