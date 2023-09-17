import { useNuiEvent } from './useNuiEvent';

const useKeyPress = (targetKey: string, callback: () => void): void => {
  useNuiEvent('keypress', (key: string) => {
    if (key === targetKey) {
      callback();
    }
  });
};

export default useKeyPress;
