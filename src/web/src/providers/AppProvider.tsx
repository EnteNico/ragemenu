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
          maxItems: 7,
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
              label: 'Button Disabled',
              description: 'Description',
              rightLabel: 'Right Label',
              options: {
                disabled: true,
              },
            },
            {
              type: 'button',
              label: 'Button',
              description: 'Description',
              rightLabel: 'Right Label',
            },
            {
              type: 'button',
              label: 'Button with a ~y~very ~s~long Text',
              description: 'Description',
              rightLabel: 'Right Label with a ~y~very ~s~long Text',
            },
            {
              type: 'checkbox',
              label: 'Checkbox',
              description: 'Description',
              options: {
                checked: true,
                style: 'cross', // tick, cross
              },
            },
            {
              type: 'colorpanel',
              label: 'Color Panel',
              description: 'Color Panel',
              rightLabel: 'Right Label',
              options: {
                current: 1,
              },
            },
            {
              type: 'grid',
              label: 'Grid',
              description: 'Grid Here',
              rightLabel: 'Right Label',
              options: {
                x: 50,
                y: 50,
              },
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
                indicator: true,
              },
            },
            {
              type: 'slider',
              label: 'Slider2',
              options: {
                min: 0,
                max: 100,
                current: 43,
                step: 4,
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
