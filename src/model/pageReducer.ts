import { createPageResource, setPage } from "./resource/PageResource";
import { Model } from "./model";

import { NOT_FOUND } from "redux-first-router";

export const routesMap = {
  HOME: "/",
  USER: "/user/:userid",
  LOGIN: "/login",
  REGISTER:"/register",
  FORGOT: "/forgot",


  // -- project api 
  PROJECT: "/project/:user/:pname",
  REF: "/project/:user/:pname/:ref", 
  
  // -- documents 
  DOC: "/doc",   
  TESTDOC:"/testdoc/:id",

  // -- document api 
  CREATE: "/create",

  LINK: "/link/:linkId" 
  //[NOT_FOUND]: '404'
};
/*


              <Route path="/create" component={CreateLink} />
              <Route path="/login" component={Login} />
              <Route path="/forgot" component={ForgotPassword} />
              <Route path="/search" component={SearchLinks} />
              <Route path="/top" component={LinkList} />
              <Route path="/new/:page" component={LinkList} />
              <Route path="/link/:linkId" component={LinkDetail} />
*/

export const pageReducer = (state: Model, action: any = {}) => {
  if (routesMap.hasOwnProperty(action.type)) {
    let { type, payload, meta } = action;
    let { query, pathname: rurl } = meta.location.current;

    console.log("--- nav to : " + action.type);
    console.log("x");

    var page = createPageResource(state, type, rurl, payload, query);
    state = setPage(state, page);

    return { ...state, page };
  }

  return state;
};



export const NavToHome = () => ({type:"HOME"})
export const NavToLogin = () =>  ({type:"LOGIN"})
 