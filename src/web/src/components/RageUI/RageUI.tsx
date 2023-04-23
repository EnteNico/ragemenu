import { useEffect, useRef, useState } from 'react';
import { Menu, Item } from '../../types/rageui';
import fetchNui from '../../utils/fetchNui';
import useNuiEvent from '../../hooks/useNuiEvent';
import Colors from '../../data/colors';
import Panels from './Panels';
import Items from './Items';
import Components from './Components';
import './RageUI.scss';

const { Badge, Select, Slider, Checkbox } = Items;
const { Label, RightLabel } = Components;
const { ColorPanel, GridPanel } = Panels;
const SkipTypes = ['placeholder'];

function RageUI({ data }: any) {
  const menuRef = useRef(null);
  const [currentMenu, setCurrentMenu] = useState<Menu>(data);
  const [activeItem, setActiveItem] = useState(0);
  const [menuData, setMenuData] = useState({
    currentItem: 0,
    maxItems: 0,
  });
  const [isDraggingGrid, setDraggingGrid] = useState(false);
  const [isDraggingSlider, setDraggingSlider] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    let nextIndex = activeItem;
    const currentItem = currentMenu.items[activeItem];

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        activeItem > 0
          ? (nextIndex = activeItem - 1)
          : (nextIndex = currentMenu.items.length - 1);

        playSound('HUD_FRONTEND_DEFAULT_SOUNDSET', 'NAV_UP_DOWN');
        break;
      case 'ArrowDown':
        e.preventDefault();
        activeItem < currentMenu.items.length - 1
          ? nextIndex++
          : (nextIndex = 0);

        playSound('HUD_FRONTEND_DEFAULT_SOUNDSET', 'NAV_UP_DOWN');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentItem.type === 'slider') {
          const step = currentItem.options.step || 1;
          if (
            currentItem.options.current > 0 &&
            currentItem.options.current - step <= currentItem.options.max
          ) {
            currentItem.options.current = currentItem.options.current - step;
          } else {
            currentItem.options.current = currentItem.options.max;
          }
        } else if (currentItem.type === 'select') {
          changeSelect(currentItem, 'left');
        } else if (currentItem.type === 'colorpanel') {
          if (currentItem.options.current > 0) {
            currentItem.options.current = currentItem.options.current - 1;
          } else {
            currentItem.options.current = Colors.length - 1;
          }
        }

        setCurrentMenu(prev => ({ ...prev }));
        playSound('HUD_FRONTEND_DEFAULT_SOUNDSET', 'NAV_LEFT_RIGHT');

        break;
      case 'ArrowRight':
        e.preventDefault();

        if (currentItem.type === 'slider') {
          const step = currentItem.options.step || 1;
          if (
            currentItem.options.current < currentItem.options.max &&
            currentItem.options.current + step <= currentItem.options.max
          ) {
            currentItem.options.current = currentItem.options.current + step;
          } else {
            currentItem.options.current = 0;
          }
        } else if (currentItem.type === 'select') {
          changeSelect(currentItem, 'right');
        } else if (currentItem.type === 'colorpanel') {
          if (currentItem.options.current < Colors.length - 1) {
            currentItem.options.current = currentItem.options.current + 1;
          } else {
            currentItem.options.current = 0;
          }
        }

        setCurrentMenu(prev => ({ ...prev }));
        fetchNui(
          'rageui:change',
          { item: currentItem, menu: currentMenu },
          () => {}
        );
        playSound('HUD_FRONTEND_DEFAULT_SOUNDSET', 'NAV_LEFT_RIGHT');
        break;
      case 'Enter':
        e.preventDefault();

        if (currentItem.type === 'placeholder') return;
        if (currentItem.options?.disabled)
          return playSound('HUD_FRONTEND_DEFAULT_SOUNDSET', 'ERROR');
        if (currentItem.type === 'checkbox') {
          currentItem.options.checked = !currentItem.options.checked;
          fetchNui(
            'rageui:change',
            { item: currentItem, menu: currentMenu },
            () => {}
          );
        }

        setCurrentMenu(prev => ({ ...prev }));
        playSound('HUD_FRONTEND_DEFAULT_SOUNDSET', 'SELECT');
        fetchNui(
          'rageui:click',
          { item: currentItem, menu: currentMenu },
          () => {}
        );
        break;
      case 'Escape':
        e.preventDefault();
        playSound('HUD_FRONTEND_DEFAULT_SOUNDSET', 'BACK');
        fetchNui('rageui:close', {}, () => {});
      case 'Backspace':
        e.preventDefault();
        playSound('HUD_FRONTEND_DEFAULT_SOUNDSET', 'BACK');
        fetchNui('rageui:back', {}, () => {});
      default:
        break;
    }

    for (let i = 0; i < currentMenu.items.length; i++) {
      if (SkipTypes.includes(currentMenu.items[nextIndex].type)) {
        if (e.key === 'ArrowUp') {
          if (nextIndex > 0) {
            nextIndex = nextIndex - 1;
          } else {
            nextIndex = currentMenu.items.length - 1;
          }
        } else if (e.key === 'ArrowDown') {
          if (nextIndex < currentMenu.items.length - 1) {
            nextIndex = nextIndex + 1;
          } else {
            nextIndex = 0;
          }
        }
      }
    }

    setActiveItem(nextIndex);
    scrollIntoView(nextIndex);
  };

  const changeSelect = (currentItem: Item, type: string) => {
    if (type === 'left') {
      if (currentItem.options.current > 0) {
        currentItem.options.current = currentItem.options.current - 1;
      } else {
        currentItem.options.current = currentItem.options.items.length - 1;
      }
    } else if (type === 'right') {
      if (currentItem.options.current < currentItem.options.items.length - 1) {
        currentItem.options.current = currentItem.options.current + 1;
      } else {
        currentItem.options.current = 0;
      }
    }
  };

  const getMaxItems = () => {
    let maxItems = 0;
    for (let i = 0; i < currentMenu.items.length; i++) {
      if (!SkipTypes.includes(currentMenu.items[i].type)) {
        maxItems++;
      }
    }
    return maxItems;
  };

  const getFirstItem = () => {
    let firstItem = 0;
    for (let i = 0; i < currentMenu.items.length; i++) {
      if (!SkipTypes.includes(currentMenu.items[i].type)) {
        firstItem = i;
        break;
      }
    }
    return firstItem;
  };

  const getLastItem = () => {
    let lastItem = 0;
    for (let i = currentMenu.items.length - 1; i >= 0; i--) {
      if (!SkipTypes.includes(currentMenu.items[i].type)) {
        lastItem = i;
        break;
      }
    }
    return lastItem;
  };

  const mouseMove = (e: any) => {
    if (isDraggingGrid) {
      const gridContainer = document.querySelector(
        '.rageui-grid-container'
      ) as HTMLElement;
      const gridCircle = document.querySelector(
        '.rageui-grid-circle'
      ) as HTMLElement;

      const gridRect = gridCircle.getBoundingClientRect();
      const gridContainerRect = gridContainer.getBoundingClientRect();

      const x = e.clientX - gridRect.left;
      const y = e.clientY - gridRect.top;

      const xPercent = (x / gridRect.width) * 100;
      const yPercent = (y / gridRect.height) * 100;

      if (
        xPercent < 0 ||
        xPercent > 100 ||
        yPercent < 0 ||
        yPercent > 100 ||
        e.clientX < gridContainerRect.left ||
        e.clientX > gridContainerRect.right ||
        e.clientY < gridContainerRect.top ||
        e.clientY > gridContainerRect.bottom
      ) {
        return setDraggingGrid(false);
      }

      const currentItem = currentMenu.items[activeItem];
      currentItem.options.x = xPercent;
      currentItem.options.y = yPercent;
      setCurrentMenu({ ...currentMenu });
    } else if (isDraggingSlider) {
      const sliderContainer = document.querySelector(
        '.rageui-item-slider-container'
      ) as HTMLElement;
      const sliderRect = sliderContainer.getBoundingClientRect();

      const x = e.clientX - sliderRect.left;
      const xPercent = (x / sliderRect.width) * 100;
      const isHoldingSlider = e.buttons === 1;

      if (xPercent < 0 || xPercent > 100 || !isHoldingSlider) {
        return setDraggingSlider(false);
      }

      const currentItem = currentMenu.items[activeItem];
      currentItem.options.current = xPercent;
      setCurrentMenu({ ...currentMenu });
    }
  };

  const playSound = (name: string, set: string) => {
    fetchNui('playSound', { name, set }, () => {});
  };

  const scrollIntoView = (index: number) => {
    const activeItemElement: HTMLElement = document.querySelector('.active')!;
    const scrollingContainer: HTMLElement =
      document.querySelector('.rageui-items')!;

    if (index === getFirstItem()) {
      scrollingContainer.scrollTop = 0;
      return;
    }

    if (index === getLastItem()) {
      scrollingContainer.scrollTop = scrollingContainer.scrollHeight;
      return;
    }

    if (activeItemElement) {
      scrollingContainer.scrollTop =
        activeItemElement.offsetTop - scrollingContainer.offsetTop;
    }
  };

  useNuiEvent('rageui:update', (data: any) => {
    setCurrentMenu(data);
    setMenuData({
      currentItem: 0,
      maxItems: getMaxItems(),
    });
    setActiveItem(0);

    for (let i = 0; i < currentMenu.items.length; i++) {
      if (!SkipTypes.includes(currentMenu.items[i].type)) {
        setActiveItem(i);
        break;
      }
    }
  });

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener(
      'wheel',
      e => {
        e.preventDefault();
      },
      { passive: false }
    );

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('wheel', e => {
        e.preventDefault();
      });
    };
  });

  useEffect(() => {
    for (let i = 0; i < currentMenu.items.length; i++) {
      if (!SkipTypes.includes(currentMenu.items[i].type)) {
        setActiveItem(i);
        break;
      }
    }

    setMenuData({
      currentItem: activeItem || 0 + 1,
      maxItems: getMaxItems(),
    });
  }, []);

  useEffect(() => {
    let currentItem = 0;
    for (let i = 0; i < currentMenu.items.length; i++) {
      if (!SkipTypes.includes(currentMenu.items[i].type)) {
        currentItem++;
      }
      if (i === activeItem) {
        break;
      }
    }

    setMenuData({
      currentItem: currentItem,
      maxItems: getMaxItems(),
    });
  }, [activeItem]);

  return (
    <div
      className="rageui"
      ref={menuRef}>
      <div className="rageui-header">
        <div className="rageui-header-title">{currentMenu.title}</div>
      </div>
      <div className="rageui-subheader">
        <div className="rageui-subheader-title">{currentMenu.subtitle}</div>
        <div className="rageui-subheader-count">
          {menuData.currentItem} / {menuData.maxItems}
        </div>
      </div>
      <div
        className="rageui-items"
        style={
          {
            '--maxItems': `${currentMenu.maxItems}`,
          } as React.CSSProperties
        }>
        {currentMenu.items.map((item: Item, index: number) => (
          <div
            className={`
                          rageui-item 
                          rageui-item-${item.type}
                          ${activeItem === index ? 'active' : ''}
                          ${
                            item.background
                              ? `background-${item.background}`
                              : ''
                          }
                          ${
                            item.options?.disabled && item.type === 'button'
                              ? 'disabled'
                              : ''
                          }
                          `}
            key={index}
            style={
              {
                '--index': `${index}`,
              } as React.CSSProperties
            }
            onClick={() => {
              if (item.type === 'placeholder') return;
              setActiveItem(index);
            }}>
            {item.label && <Label label={item.label} />}
            {item.rightLabel && !item.options?.disabled && (
              <RightLabel rightLabel={item.rightLabel} />
            )}
            {item.badge && <Badge badge={item.badge} />}
            {item.type === 'slider' && (
              <Slider
                item={item}
                onMouseDown={() => {
                  setDraggingSlider(true);
                }}
                onMouseUp={() => {
                  setDraggingSlider(false);
                }}
              />
            )}
            {item.type === 'select' && (
              <Select
                item={item}
                onChange={(type: string) => {
                  console.log(type);
                  const currentItem = currentMenu.items[activeItem];
                  changeSelect(currentItem, type);
                  setCurrentMenu(prev => ({ ...prev }));
                }}
              />
            )}
            {item.type === 'checkbox' && <Checkbox item={item} />}
            {item.options?.disabled && item.type === 'button' && (
              <div className="rageui-item-disabled">
                <img src="assets/ActionMenu/icons/commonmenu/shop_lock.png" />
              </div>
            )}
          </div>
        ))}
      </div>
      {currentMenu.items.length > currentMenu.maxItems && (
        <div
          className="rageui-scroll"
          style={{ marginTop: '0.2vh' }}>
          <div className="rageui-scroll-img">
            <img src="assets/ActionMenu/icons/commonmenu/shop_arrows_upanddown.png" />
          </div>
        </div>
      )}
      {activeItem !== null && currentMenu.items[activeItem].description && (
        <div className="rageui-item-description">
          <span>{currentMenu.items[activeItem].description}</span>
          <div className="rageui-item-icon">
            <img src="assets/ActionMenu/icons/info_icon_32.png" />
          </div>
        </div>
      )}
      {activeItem !== null && currentMenu.items[activeItem].type === 'grid' && (
        <GridPanel
          activeItem={activeItem}
          currentMenu={currentMenu}
          setDraggingGrid={setDraggingGrid}
        />
      )}
      {activeItem !== null &&
        currentMenu.items[activeItem].type === 'colorpanel' && (
          <ColorPanel
            activeItem={activeItem}
            currentMenu={currentMenu}
          />
        )}
    </div>
  );
}

export default RageUI;
