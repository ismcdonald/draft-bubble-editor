export type int = number;
export type PageState<a> = {
  url: string;
  fullURL: string;
  isLoading: boolean;
  isReady: boolean;
  errorMsg?: string[];
  data?: a;
};

export type Model = {
  page?: PageState<any>;
  resources: { [path: string]: PageState<any> };
  config: {
    host: string;
    ver:number;
  };
};

export function getPageState(state: Model, url: string): PageState<any> {
  var page = state.resources[url];
  if (!page) {
    // -- NOTE: - lazily creating page state
    page = state.resources[url] = {
      url,
      fullURL: `${state.config.host}/${url}/index.json`,
      isLoading: false,
      isReady: false,
    };
    state.resources[url] = page;
  }
  return page;
}

var uid:number = 1

export const defaultState = (): Model => ({
  page: undefined,
  resources: {},
  config: {
    host: "http://localhost:3000/data",
    ver: uid++
  },
});
