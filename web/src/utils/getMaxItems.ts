import type { Item } from '../types';

export function getMaxItems(items: Item[]) {
  let maxItems = 0;

  for (const item of items) {
    if (item.type === 'placeholder') {
      continue;
    }

    maxItems++;
  }

  return maxItems;
}
