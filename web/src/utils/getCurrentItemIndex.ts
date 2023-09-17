import type { Item } from '../types';

export function getCurrentItemIndex(items: Item[], selectedItem?: Item) {
  let currentItemIndex = 0;
  if (!selectedItem) return;

  const currentItem = items.find(item => item.uuid === selectedItem.uuid);
  if (!currentItem) {
    console.warn('No current item');
    return currentItemIndex;
  }

  const filteredItems = items.filter(item => item.type !== 'placeholder');
  currentItemIndex = filteredItems.indexOf(currentItem);

  return currentItemIndex + 1;
}
