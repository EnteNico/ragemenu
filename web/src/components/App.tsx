import {
  ItemDescription,
  MenuItem,
  MenuScrolling,
  Header,
  Subheader,
} from './exports';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  getMaxItems,
  getFirstItem,
  getLastItem,
  getCurrentItemIndex,
  menuControl,
  replaceColors,
} from '../utilts';
import type { Menu, Item, MenuContextProps } from '../types';
import { fetchNui } from '../utils/fetchNui';
import '../css/menu.scss';
import { isEnvBrowser } from '../utils/misc';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { useVisibility } from '../providers/VisibilityProvider';
import { PanelSide } from './menu/Sidepanel';

export const MenuContext = createContext<MenuContextProps>({
  updateItem: () => {},
  updateMenu: () => {},
});

export default function App({ data }: { data: Menu }) {
  const [menu, setMenu] = useState<Menu>(data);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const menuContext = useContext(MenuContext);
  const appContext = useVisibility();

  const scrollIntoView = (index: number) => {
    if (!menu || menu.items.length <= menu.maxItems) return;
    const activeItemElement: HTMLElement = document.querySelector('.selected')!;
    const scrollingContainer: HTMLElement =
      document.querySelector('.menu-scrolling')!;

    const firstItem = getFirstItem(menu.items);
    const firstItemIndex = getCurrentItemIndex(menu.items, firstItem);
    if (index === firstItemIndex) {
      scrollingContainer.scrollTop = 0;
      return;
    }

    const lastItem = getLastItem(menu.items);
    const lastItemIndex = getCurrentItemIndex(menu.items, lastItem);
    if (index === lastItemIndex) {
      scrollingContainer.scrollTop = scrollingContainer.scrollHeight;
      return;
    }

    if (activeItemElement) {
      scrollingContainer.scrollTop =
        activeItemElement.offsetTop - scrollingContainer.offsetTop;
    }
  };

  const initialSetup = () => {
    if (!menu) return;
    const firstItem = getFirstItem(menu.items);
    const itemIndex = getCurrentItemIndex(menu.items, firstItem);

    if (itemIndex) {
      setSelectedItem(firstItem);
      setCurrentItemIndex(itemIndex);
    }
  };

  const updateItem = (oldItem: Item, newItem: Item, lastSelected?: Item) => {
    setMenu((prev: Menu) => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.uuid === oldItem.uuid) return newItem;
        return item;
      }),
    }));

    if (
      oldItem.type === 'placeholder' &&
      newItem.type === 'placeholder' &&
      lastSelected
    ) {
      setSelectedItem(lastSelected);
      return;
    }

    setSelectedItem(newItem);
    fetchNui('changeItem', {
      oldItem,
      newItem,
      resource: menu.resource,
    });
  };

  useEffect(() => {
    const element = document.querySelector('.menu-scrolling');
    if (!selectedItem) initialSetup();
    if (element) {
      element.addEventListener('scroll', e => {
        e.preventDefault();
        e.stopPropagation();
      });

      element.addEventListener('wheel', e => {
        e.preventDefault();
        e.stopPropagation();
      });

      return () => {
        element.removeEventListener('scroll', e => {
          e.preventDefault();
          e.stopPropagation();
        });

        element.removeEventListener('wheel', e => {
          e.preventDefault();
          e.stopPropagation();
        });
      };
    }
  }, []);

  useEffect(() => {
    if (
      !menu ||
      !selectedItem ||
      (menu.title === 'Dev Mode' && !isEnvBrowser())
    )
      return;
    const itemIndex = getCurrentItemIndex(menu.items, selectedItem);
    if (itemIndex) {
      setCurrentItemIndex(itemIndex);
      scrollIntoView(itemIndex);
      fetchNui('activeItem', {
        item: selectedItem,
        resource: menu.resource,
      });
    }
  }, [selectedItem]);

  useNuiEvent('keypress', (key: string) => {
    switch (key) {
      case 'UP':
        if (!selectedItem) return setSelectedItem(getFirstItem(menu.items));
        setSelectedItem(prev => menuControl(menu.items, prev!, 'up'));
        fetchNui('upDownSound', {
          resource: menu.resource,
        });
        break;
      case 'DOWN':
        if (!selectedItem) return setSelectedItem(getFirstItem(menu.items));
        setSelectedItem(prev => menuControl(menu.items, prev!, 'down'));
        fetchNui('upDownSound', {
          resource: menu.resource,
        });
        break;
      case 'ENTER':
        if (!selectedItem) return;
        fetchNui('selectItem', {
          item: selectedItem,
          resource: menu.resource,
        });
        break;
      case 'CLOSE':
        fetchNui('closeMenu', menu);
        break;
      default:
        break;
    }
  });

  useNuiEvent(
    'updateItem',
    ({
      menuUUID,
      oldItem,
      newItem,
    }: {
      menuUUID: string;
      oldItem: Item;
      newItem: Item;
    }) => {
      if (menuUUID !== menu.uuid)
        return console.log('Menu UUID does not match', menuUUID, menu.uuid);
      updateItem(oldItem, newItem, selectedItem);
    }
  );

  if (
    !menu ||
    !menu.items.length ||
    (menu.title === 'Dev Mode' && !isEnvBrowser())
  )
    return null;
  return (
    <MenuContext.Provider
      value={{
        updateItem: (oldItem: Item, newItem: Item) =>
          updateItem(oldItem, newItem),
        updateMenu: menu => {
          setSelectedItem(getFirstItem(menu.items));
          setCurrentItemIndex(0);
        },
      }}>
      <div
        className={`menu-container m-menu flex ${
          menu.position && menu.position
        }`}>
        <div
          className={`menu w-menuWidth text-normal tracking-menu
          ${menu.theme && `theme-${menu.theme}`}
          `}>
          <Header banner={menu.banner}>
            <div
              className="truncate"
              dangerouslySetInnerHTML={{
                __html: replaceColors(menu.title),
              }}
            />
          </Header>
          <Subheader>
            <div
              className="truncate"
              dangerouslySetInnerHTML={{
                __html: replaceColors(menu.subtitle),
              }}
            />
            <div>
              {currentItemIndex}/{getMaxItems(menu.items)}
            </div>
          </Subheader>
          <div
            className="menu-content gradient-img menu-scrolling"
            style={{
              maxHeight: `calc(${menu.maxItems} * 4vh)`,
              overflowY: 'auto',
            }}>
            {menu.items.map((item, index) => (
              <MenuItem
                key={index}
                item={item}
                selected={item === selectedItem}
                selectedItem={selectedItem}
                menuContext={menuContext}
              />
            ))}
          </div>
          {menu.items.length > menu.maxItems && <MenuScrolling />}
          {selectedItem && selectedItem.description && (
            <ItemDescription text={selectedItem.description} />
          )}
        </div>
        {selectedItem && selectedItem.sidepanel && (
          <PanelSide sidepanel={selectedItem.sidepanel} />
        )}
      </div>
      {/* <InstructionalButtons /> */}
    </MenuContext.Provider>
  );
}
