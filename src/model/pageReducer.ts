import {  setPage, addPageLinks, PageState, pageTorurl, createPageResource, resolvePageResource } from "./resource/PageResource";
import { Model } from "./model";
import {  pathToAction, actionToPath } from "redux-first-router";
import queryString from 'query-string'
import assert from "./util/assert";

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
  DOCS:"/docs/:user/:project", 
  DOC: "/doc/:user/:id",   
  TESTDOC:"/testdoc/:user:id",

  // -- document api 
  CREATE: "/create/:project",

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

export const uriToAction = (ruri:string) => {
  return pathToAction(ruri, routesMap, queryString)
}
export const actionToURI = (action:any) => {
  return actionToPath(action, routesMap, queryString)
}

export const pageReducer = (state: Model, action: any = {}) => {
  if (routesMap.hasOwnProperty(action.type)) {
    let { type, payload, meta } = action;
    let { query, pathname: rurl } = meta.location.current;

    console.log("--- nav to : " + action.type);


    var page:PageState<any,any> = createPageResource(state, type, rurl, payload, query);


    // -- TO_ABSTRACT
    //  pages specify an second page in the query of the uri ie   /doc/docID?view="/project/etc/..."
    //  need to resolve it, 
    //  
    
    if (type == "DOC" || type == "TESTDOC") {
      
      // -- hypermeid a
      var project:string = "/project/lea/essay"
      state = resolvePageResource(state,  project) // makes sure this is resolved

      page = addPageLinks(page, {project, projects:"/"})
      
      
      // -- filter. Note that for documents etc, query to filter is handled in resolve resouce page


      page.filter = {showView: (query && query.showView) ? true : false }

      if (query) {
        
        if (query.view) {
          var view = uriToAction(query.view)
          if (view) {
            if (view.type != "REF" && view.type != "PROJECT" && view.type != "HOME") {  // <-- only allow references to Project pages 
              assert(false, "")  // probably want project
            } else {
              const viewRurl = actionToURI({type:view.type, payload:view.payload } ) // <-- reconstruct w/o query
              const viewQuery = view.meta ? (view.meta as any).query : {};
              var viewPage:PageState<any,any> = createPageResource(state, view.type, viewRurl, view.payload, viewQuery)
              state = setPage(state, viewPage); 
              
              // -- a document might resonably be associated with a project 
              //   For the moment hardcoding this
              page = addPageLinks(page, 
                    {
                        view: pageTorurl(viewPage),
                    })
              // FIX_THIS bug - prevents hide view from 
              //page.filter.showView = true
              // -- Hardcoding reference to the underlying project page
            

            
            
            }

          


          }
        }
      }
    } 

  
    state = setPage(state, page);

    return { ...state, page };
  }

  return state;
};

  



export const NavToHome = () => ({type:"HOME"})
export const NavToLogin = () =>  ({type:"LOGIN"})
 