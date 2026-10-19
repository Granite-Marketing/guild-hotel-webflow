/**
 * Finsweet Attributes v1 callback queue. Finsweet scripts read this array
 * when they boot, so modules push `['cmsfilter', callback]` entries onto it
 * with `window.fsAttributes ??= []` whether or not Finsweet has loaded yet.
 */
interface Window {
  fsAttributes?: unknown[];
}

interface FinsweetListItem {
  element: HTMLElement;
}

interface FinsweetListInstance {
  on: (event: string, callback: () => void) => void;
  items: FinsweetListItem[];
}

interface FinsweetFilterInstance {
  listInstance: FinsweetListInstance;
}
