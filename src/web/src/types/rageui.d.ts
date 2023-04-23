type ItemTypes =
  | 'button'
  | 'slider'
  | 'select'
  | 'checkbox'
  | 'placeholder'
  | 'grid'
  | 'heritage'
  | 'colorpanel';

interface Menu {
  name: string;
  title: string;
  subtitle: string;
  maxItems: number;
  items: Item[];
}

interface Item {
  label: string;
  name: string;
  description: string;
  type: ItemTypes;
  options: any;
  badge: string;
  rightLabel: string;
  background: string;
  uuid: string;
}

export { Menu, Item, ItemTypes };
