declare const window: any;
export const isEnvBrowser = (): boolean => !window.invokeNative;
