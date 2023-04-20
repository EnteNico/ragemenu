import { components } from '../utils/getComponents';

interface IProps {
  name: string;
  data?: object;
}

export function GetComponent({ name, ...props }: IProps) {
  // @ts-ignore
  const Component = components[name];
  return Component ? <Component {...props} /> : null;
}
