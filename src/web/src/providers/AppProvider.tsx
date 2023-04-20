import { createContext, useEffect, useState } from 'react';
import { GetComponent } from '../components/GetComponent';
import { components } from '../utils/getComponents';
import { isEnvBrowser } from '../utils/isEnvBrowser';
import useNuiEvent from '../hooks/useNuiEvent';
import { debugData } from '../utils/debugData';

interface ToggleProps {
  component: string;
  data: any;
  bool: boolean;
}

interface ComponentProps {
  name: string;
  data: any;
}

debugData(
  [
    {
      action: 'toggle',
      data: {
        component: 'rageui',
        data: {
          name: 'main',
          title: 'RageUI Clone',
          subtitle: 'Categorie',
          maxItems: 12,
          items: [
            {
              type: 'placeholder',
              label: 'Placeholder ~b~Colored',
            },
            {
              type: 'placeholder',
              label: 'Another Placeholder',
            },
            {
              type: 'button',
              label: 'Button',
              description: 'Description',
              rightlabel: 'Right Label',
            },
            {
              type: 'button',
              label: 'Button2',
              badge: 'shop_garage_icon_a',
            },
            {
              type: 'button',
              label: 'Button3',
              description: 'Another Description',
              badge: 'shop_clothing_icon_a',
            },
            {
              type: 'button',
              label: 'Button4',
              description: 'Another Description',
              badge: 'shop_barber_icon_a',
            },
            {
              type: 'button',
              label: 'Button5',
              description: 'Another Description',
              badge: 'shop_garage_bike_icon_a',
            },
            {
              type: 'button',
              label: 'Button6',
              description: 'Another Description',
              badge: 'shop_garage_bike_icon_a',
            },
            {
              type: 'button',
              label: 'Button7',
              description: 'Another Description',
              badge: 'shop_makeup_icon_a',
            },
            {
              type: 'button',
              label: 'Button8',
              description: 'Another Description',
              badge: 'shop_mask_icon_a',
            },
            {
              type: 'button',
              label: 'Button9',
              description: 'Another Description',
              badge: 'shop_tattoos_icon_a',
            },
            {
              type: 'placeholder',
              label: 'Placeholder',
            },
            {
              type: 'placeholder',
              label: 'Another Placeholder',
            },
            {
              type: 'slider',
              label: 'Slider',
              options: {
                min: 0,
                max: 100,
                current: 10,
              },
            },
            {
              type: 'slider',
              label: 'Slider2',
              options: {
                min: 0,
                max: 100,
                current: 43,
              },
            },
            {
              type: 'select',
              label: 'Select',
              options: {
                current: 0,
                items: ['Item 1', 'Item 2', 'Item 3'],
              },
            },
            {
              type: 'select',
              label: 'Select2',
              options: {
                current: 1,
                items: ['Item 1 Long Name', 'Item 2', 'Item 3'],
              },
            },
          ],
        },
        bool: true,
      },
    },
  ],
  10
);

export const AppContext = createContext({});
export const AppProvider = () => {
  const devMode = isEnvBrowser();
  const [currentComponents, setCurrentComponents] = useState<ComponentProps[]>([
    {
      name: 'text',
      data: {},
    },
  ]);

  useNuiEvent('toggle', ({ component, data, bool }: ToggleProps) => {
    if (bool) {
      setCurrentComponents([...currentComponents, { name: component, data }]);
    } else {
      setCurrentComponents(currentComponents.filter(c => c.name !== component));
    }
  });

  useEffect(() => {
    if (devMode) {
      document.body.classList.add('dev-mode');
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentComponents,
        setCurrentComponents,
      }}>
      <div className="app-container">
        {Object.keys(components).map((Component, index) => {
          if (currentComponents.some(c => c.name === Component)) {
            return (
              <GetComponent
                key={index}
                name={Component}
                data={currentComponents.find(c => c.name === Component)?.data}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </AppContext.Provider>
  );
};
