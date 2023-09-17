import React, {
  Context,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { isEnvBrowser } from '../utils/misc';
import App from '../components/App';
import { Menu } from '../types';

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null);

interface VisibilityProviderValue {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  devMode: boolean;
  setDevMode: (devMode: boolean) => void;
}

const devData: Menu = {
  uuid: 'lol',
  title: 'Dev Mode',
  subtitle: 'RageMenu SHOWCASE',
  resource: 'lol',
  maxItems: 10,
  items: [
    {
      uuid: uuid(),
      name: 'Gradient Placeholder',
      type: 'placeholder',
    },
    { uuid: uuid(), name: '~r~Colored Placeholder', type: 'placeholder' },
    {
      uuid: uuid(),
      name: 'Gradient Menu Item',
      type: 'button',
      background:
        'linear-gradient(68.6deg, rgb(252, 165, 241) 1.8%, rgb(181, 255, 255) 100.5%)',
      sidepanel: {
        title: 'Sidepanel Title',
        image: 'sidepanel',
        items: [
          {
            leftLabel: 'Left Label',
            rightLabel: 'Right Label',
          },
          {
            leftLabel: 'Left Label',
            rightLabel: 'Right Label',
          },
          {
            leftLabel: 'Left Label',
            rightLabel: 'Right Label',
          },
          {
            leftLabel: 'Left Label',
            rightLabel: 'Right Label',
          },
        ],
      },
    },
    {
      uuid: uuid(),
      name: 'Menu Item',
      rightLabel: 'Label Right',
      type: 'button',
      description: 'This has a ~b~description',
    },
    { uuid: uuid(), name: '~y~Colored Menu Item', type: 'button' },
    {
      uuid: uuid(),
      name: 'Slider',
      type: 'slider',
      other: {
        min: 0,
        max: 100,
        value: 50,
        step: 2,
      },
    },
    {
      uuid: uuid(),
      name: 'List',
      type: 'list',
      other: {
        items: ['Item 1', 'Item 2', 'Item 3'],
        current: 0,
      },
    },
    {
      uuid: uuid(),
      name: 'Checkbox',
      type: 'checkbox',
      other: { checked: false },
    },
  ],
};

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const VisibilityProvider: React.FC = ({}) => {
  const [visible, setVisible] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [data, setData] = useState<Menu>();

  useNuiEvent(
    'setVisible',
    ({ visible, data }: { visible: boolean; data: Menu }) => {
      setVisible(visible);
      setData(data);
    }
  );

  useNuiEvent('copyClipboard', ({ value }: { value: string }) => {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });

  useEffect(() => {
    if (isEnvBrowser()) {
      setDevMode(true);
      setData(devData);
      setVisible(true);
      document.body.classList.add('dev');
    }
  }, []);

  if (!visible || !data) return null;
  return (
    <VisibilityCtx.Provider
      value={{
        visible,
        setVisible,
        devMode,
        setDevMode,
      }}>
      <div style={{ height: '100%' }}>
        <App data={data} />
      </div>
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = () =>
  useContext<VisibilityProviderValue>(
    VisibilityCtx as Context<VisibilityProviderValue>
  );
