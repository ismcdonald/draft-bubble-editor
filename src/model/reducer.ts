import { Model, PageState, defaultState } from "./model";

const reducer = (state: Model, action: any): Model => {
  if (!state) {
    return defaultState();
  }

  var newState: Model = state;

  switch (action.type) {
    case "LoadStart":
      let page0: PageState<any> = action.page;
      let page1: PageState<any> = {
        ...page0,
        isLoading: true,
        isReady: false,
        errorMsg: undefined,
      };

      newState = setPage(state, page1);
      break;

    case "LoadComplete":
      var newPage: PageState<any> = {
        ...action.page,
        isLoading: false,
        isReady: true,
        data: action.data,
        errorMsg: undefined,
      };
      newState = setPage(state, newPage);
      break;
    case "LoadError":
      let { page, e } = action;
      var errPage: PageState<any> = {
        ...page,
        isLoading: false,
        isReady: false,
        data: null,
        errorMsg: [
          `error loading ${page.uri}`,
          e.message || " (unknown error message) ",
        ],
      };

      newState = setPage(state, errPage);
      break;
    case "Notification":
      // Notification
      console.log("Got notification: " +  action.msg + "\n---details:---\n" + action.details)
      break
    case "NavTo":
      break;
    default:
      console.log("unknown action ", { action });
      throw new Error(" unknown acton " + action.type);
  }

  return newState;
};

export default reducer;

function setPage(state: Model, page: PageState<any>): Model {
  var resources = { ...state.resources }; // <-- slow for large numbers of resources?
  resources[page.url] = page;
  return { ...state, resources };
}

