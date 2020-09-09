import { Model, defaultState } from "./model";
import { PageState, setLoading, setPage, setReady, setErr } from "./resource/PageResource";

const modelReducer = (state: Model, action: any): Model => {
  if (!state) {
    return defaultState();
  }

  var newState: Model = state;
  var page: PageState<any, any>
  var page1: PageState<any, any>

  switch (action.type) {

    case "LoadStart": 
      ({page}= action);
      page1 = { ...page,status: setLoading(page) };
        
      newState = setPage(state, page1);
      break;

    case "LoadComplete":
      var data:any
      ({page, data} = action);
      page1 = { ...page, data, status: setReady(page) }
      newState = setPage(state, page1);
      break;

    case "LoadError":
      var e;
      ({ page, e } = action);
      page1 = {  ...page,data:undefined, status:setErr(page,e) }
      newState = setPage(state, page1);
      break;

    case "Notification":
      // Notification
      console.log("Got notification: " +  action.msg + "\n---details:---\n" + action.details)
      break

    case "NavTo":
      const url = action.url
      console.log("TODO - navigate to " + action.url)
      break;
    
  }

  return newState;
};

export default modelReducer
