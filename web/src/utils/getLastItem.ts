import type { Item } from '../types';

export function getLastItem(items: Item[]) {
  const newItems = [...items].reverse();

  for (const item of newItems) {
    if (item.type === 'placeholder') {
      continue;
    }

    return item;
  }
}
