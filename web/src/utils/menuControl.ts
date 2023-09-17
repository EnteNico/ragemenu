import type { Item } from '../types';
import { getFirstItem } from './getFirstItem';

// ArrowDown
export function menuControl(
  items: Item[],
  currentItem: Item,
  direction: 'down' | 'up'
) {
  const filteredItems = items.filter(item => item.type !== 'placeholder');
  const firstItem = getFirstItem(items);
  const lastItem = filteredItems[filteredItems.length - 1];
  if (!currentItem) return firstItem;

  const currentItemIndex = filteredItems.indexOf(currentItem);
  if (direction === 'down') {
    if (currentItemIndex === filteredItems.length - 1) return firstItem;

    const item = filteredItems[currentItemIndex + 1];
    return item;
  }

  if (direction === 'up') {
    if (currentItemIndex === 0) return lastItem;

    const item = filteredItems[currentItemIndex - 1];
    return item;
  }

  return firstItem;
}
