import { useEffect, useRef, useState } from 'react';
import fetchNui from '../../utils/fetchNui';
import useNuiEvent from '../../hooks/useNuiEvent';
import './RageUI.scss';

type ItemTypes = 'button' | 'slider' | 'select' | 'placeholder';

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

function RageUI({ data }: any) {
  const menuRef = useRef(null);
  const [currentMenu, setCurrentMenu] = useState<Menu>(data);
  const [activeItem, setActiveItem] = useState(0);
  const [menuData, setMenuData] = useState({
    currentItem: 0,
    maxItems: 0,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    let nextIndex = activeItem;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();

        if (activeItem > 0) {
          nextIndex = activeItem - 1;
        } else {
          nextIndex = currentMenu.items.length - 1;
        }

        fetchNui(
          'playSound',
          {
            name: 'HUD_FRONTEND_DEFAULT_SOUNDSET',
            set: 'NAV_UP_DOWN',
          },
          () => {}
        );
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (activeItem < currentMenu.items.length - 1) {
          nextIndex = activeItem + 1;
        } else {
          nextIndex = 0;
        }

        fetchNui(
          'playSound',
          {
            name: 'HUD_FRONTEND_DEFAULT_SOUNDSET',
            set: 'NAV_UP_DOWN',
          },
          () => {}
        );
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentMenu.items[activeItem].type === 'slider') {
          if (currentMenu.items[activeItem].options.current > 0) {
            currentMenu.items[activeItem].options.current =
              currentMenu.items[activeItem].options.current - 1;
            setCurrentMenu({ ...currentMenu });
          } else {
            currentMenu.items[activeItem].options.current =
              currentMenu.items[activeItem].options.max;
            setCurrentMenu({ ...currentMenu });
          }
        } else if (currentMenu.items[activeItem].type === 'select') {
          if (currentMenu.items[activeItem].options.current > 0) {
            currentMenu.items[activeItem].options.current =
              currentMenu.items[activeItem].options.current - 1;
            setCurrentMenu({ ...currentMenu });
          } else {
            currentMenu.items[activeItem].options.current =
              currentMenu.items[activeItem].options.items.length - 1;
            setCurrentMenu({ ...currentMenu });
          }
        }

        fetchNui(
          'playSound',
          {
            name: 'HUD_FRONTEND_DEFAULT_SOUNDSET',
            set: 'NAV_LEFT_RIGHT',
          },
          () => {}
        );
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentMenu.items[activeItem].type === 'slider') {
          const currentItem = currentMenu.items[activeItem];

          if (
            currentMenu.items[activeItem].options.current <
            currentMenu.items[activeItem].options.max
          ) {
            currentMenu.items[activeItem].options.current =
              currentMenu.items[activeItem].options.current + 1;
            setCurrentMenu({ ...currentMenu });
          } else {
            currentMenu.items[activeItem].options.current = 0;
            setCurrentMenu({ ...currentMenu });
          }

          fetchNui(
            'rageui:change',
            { item: currentItem, menu: currentMenu },
            () => {}
          );
        } else if (currentMenu.items[activeItem].type === 'select') {
          const currentItem = currentMenu.items[activeItem];

          if (
            currentMenu.items[activeItem].options.current <
            currentMenu.items[activeItem].options.items.length - 1
          ) {
            currentMenu.items[activeItem].options.current =
              currentMenu.items[activeItem].options.current + 1;
            setCurrentMenu({ ...currentMenu });
          } else {
            currentMenu.items[activeItem].options.current = 0;
            setCurrentMenu({ ...currentMenu });
          }

          fetchNui(
            'rageui:change',
            { item: currentItem, menu: currentMenu },
            () => {}
          );
        }

        fetchNui(
          'playSound',
          {
            name: 'HUD_FRONTEND_DEFAULT_SOUNDSET',
            set: 'NAV_LEFT_RIGHT',
          },
          () => {}
        );
        break;
      case 'Enter':
        e.preventDefault();

        const currentItem = currentMenu.items[activeItem];
        fetchNui(
          'playSound',
          {
            name: 'HUD_FRONTEND_DEFAULT_SOUNDSET',
            set: 'SELECT',
          },
          () => {}
        );
        fetchNui(
          'rageui:click',
          { item: currentItem, menu: currentMenu },
          () => {}
        );
        break;
      case 'Escape':
        e.preventDefault();

        fetchNui(
          'playSound',
          {
            name: 'HUD_FRONTEND_DEFAULT_SOUNDSET',
            set: 'BACK',
          },
          () => {}
        );
        fetchNui('rageui:close', {}, () => {});
      case 'Backspace':
        e.preventDefault();

        fetchNui(
          'playSound',
          {
            name: 'HUD_FRONTEND_DEFAULT_SOUNDSET',
            set: 'BACK',
          },
          () => {}
        );
        fetchNui('rageui:back', {}, () => {});
      default:
        break;
    }

    for (let i = 0; i < currentMenu.items.length; i++) {
      if (currentMenu.items[nextIndex].type === 'placeholder') {
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
    const activeItemElement: HTMLElement = document.querySelector('.active')!;
    const scrollingContainer: HTMLElement =
      document.querySelector('.rageui-items')!;

    if (activeItemElement) {
      scrollingContainer.scrollTop =
        activeItemElement.offsetTop - scrollingContainer.offsetTop;
    }
  };

  const replaceColors = (text: string) => {
    return text
      .replace(/~r~/g, '<span class="text-red">')
      .replace(/~g~/g, '<span class="text-green">')
      .replace(/~b~/g, '<span class="text-blue">')
      .replace(/~y~/g, '<span class="text-yellow">')
      .replace(/~p~/g, '<span class="text-purple">')
      .replace(/~o~/g, '<span class="text-orange">')
      .replace(/~c~/g, '<span class="text-cyan">')
      .replace(/~m~/g, '<span class="text-magenta">')
      .replace(/~u~/g, '<span class="text-black">')
      .replace(/~s~/g, '<span class="text-white">')
      .replace(/~n~/g, '</span>');
  };

  const getMaxItems = () => {
    let maxItems = 0;
    for (let i = 0; i < currentMenu.items.length; i++) {
      if (currentMenu.items[i].type !== 'placeholder') {
        maxItems++;
      }
    }
    return maxItems;
  };

  useNuiEvent('rageui:update', (data: any) => {
    setCurrentMenu(data);

    for (let i = 0; i < currentMenu.items.length; i++) {
      if (currentMenu.items[i].type !== 'placeholder') {
        setActiveItem(i);
        break;
      }
    }

    setMenuData({
      currentItem: activeItem || 0 + 1,
      maxItems: getMaxItems(),
    });
  });

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    for (let i = 0; i < currentMenu.items.length; i++) {
      if (currentMenu.items[i].type !== 'placeholder') {
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
      if (currentMenu.items[i].type !== 'placeholder') {
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
        {currentMenu.items.map((item: Item, index: number) => {
          return (
            <div
              className={`
                rageui-item 
                rageui-item-${item.type}
                ${activeItem === index ? 'active' : ''}
                ${item.background ? `background-${item.background}` : ''}
                `}
              key={index}
              style={
                {
                  '--index': `${index}`,
                } as React.CSSProperties
              }>
              <div className="rageui-item-label">
                <span
                  dangerouslySetInnerHTML={{
                    __html: replaceColors(item.label),
                  }}></span>
              </div>
              {item.rightLabel && (
                <div className="rageui-item-rightlabel">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: replaceColors(item.rightLabel),
                    }}></span>
                </div>
              )}
              {item.badge && (
                <div className="rageui-item-badge">
                  <img
                    src={`assets/ActionMenu/icons/commonmenu/${item.badge}.png`}
                  />
                </div>
              )}
              {item.type === 'slider' && (
                <div className="rageui-item-slider-container">
                  <div
                    className="rageui-item-slider"
                    style={{
                      width: `${
                        (item.options.current / item.options.max) * 100
                      }%`,
                    }}></div>
                </div>
              )}
              {item.type === 'select' && (
                <div className="rageui-item-select-container">
                  <ChevronLeft />
                  {item.options.items[item.options.current]}
                  <ChevronRight />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {currentMenu.items.length > currentMenu.maxItems && (
        <div className="rageui-scroll">
          <div className="rageui-scroll-img">
            <img src="assets/ActionMenu/icons/commonmenu/shop_arrows_upanddown.png" />
          </div>
        </div>
      )}
      {activeItem && currentMenu.items[activeItem].description && (
        <div className="rageui-item-description">
          <span>{currentMenu.items[activeItem].description}</span>
          <div className="rageui-item-icon">
            <img src="assets/ActionMenu/icons/info_icon_32.png" />
          </div>
        </div>
      )}
    </div>
  );
}

const ChevronLeft = () => (
  <div className="icon-left">
    <img src="assets/ActionMenu/icons/commonmenu/arrowleft.png" />
  </div>
);

const ChevronRight = () => (
  <div className="icon-right">
    <img src="assets/ActionMenu/icons/commonmenu/arrowright.png" />
  </div>
);

export default RageUI;
