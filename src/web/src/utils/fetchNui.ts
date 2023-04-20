import { isEnvBrowser } from './isEnvBrowser';

declare const window: any;
export default async function fetchNui(
  eventName: string,
  data: any,
  mockData: any
) {
  if (isEnvBrowser()) return;

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  const resourceName = window.GetParentResourceName
    ? window.GetParentResourceName()
    : 'RageMenu';

  return new Promise((resolve, reject) => {
    fetch(`https://${resourceName}/${eventName}`, options)
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(e => {
        return;
      });
  });
}
