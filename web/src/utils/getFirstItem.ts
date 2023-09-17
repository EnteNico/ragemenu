import type { Item } from '../types';

export function getFirstItem(items: Item[]) {
  for (const item of items) {
    if (item.type === 'placeholder') {
      continue;
    }

    return item;
  }
}
