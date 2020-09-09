import { uriToAction } from './../pageReducer';
import { getPageStatus, PageState } from './../resource/PageResource';
import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Model, State } from "../model";

const axios = require("axios");

export const createResourceLoader = (url: string) => async () => {
  const apiData = await axios.get(url);
  console.log(apiData);
  return apiData;
};


/**
 * 
 * FIX_THIS - this is not a great mechanism
 * 
 * ie. It precludes that current page view itself ..
 * 
 * need a better mechanism
 * 
 * @param rurl  // the page from which this is called
 */
export const useViewNav = (rurl:string):any => {
  var pageURL = useCurrentPage()
  var page = usePage(pageURL)

  if (rurl == pageURL) {
    // -- 1. simple case. When called from the 
    //     current page, just create an action 
    return  (rurl:string) => {
      return uriToAction(rurl) 
    }
  }
  // -- 2. otherwise, this 
  return toViewNav(page)

}




/**
 * Returns function that will take a uri, and wrap it as a view query on 
 * the crrent page
 * 
 *  ie. doc
 *   
 * 
 * @param page 
 */
const toViewNav = (page:PageState<any,any>) => {
  
  
  let {type, params:payload} = page.resource
  var base = {type:type.toUpperCase(), payload}
  
  return (view:string) => {
    return {...base, query:{view, showView:true}} // <-- a redux-first-router action
  }

}

export const useParams = ():any => {
  var page = usePage(useCurrentPage())
  return page ? page.resource.params : {}
}


export function useCurrentPage():string {
  return  useSelector((s:State) => (s.app.page!.resource.rurl))
}


export const usePage = (rurl:string):PageState<any,any> => {
    return useSelector((s:State) => s.app.resources[rurl])
}


/**
 * Page loader
 *   Given an rurl (ie 'project/user/project-name'),
 *   - via readux, queries the model for a resource descriptor
 * @param url
 * @param dispatch
 */
export const usePageLoader = (rurl:string):PageState<any,any> => {
  const page = usePage(rurl)
  if (!page) {
    throw `NO PAGE for ${rurl}`
  }
  let {status} = page

  const dispatch = useDispatch()
  const loader = useCallback(createResourceLoader(status.fullURL!), [status]);


  useEffect(() => {
    const load = async () => {
      try {
        dispatch({ type: "LoadStart", page,  });
        const result = await loader();
        dispatch({ type: "LoadComplete", page, data: result.data });
      } catch (e) {
        dispatch({ type: "LoadError", page, e });
      }
    };
    if (status && status.fullURL && !status.isReady && !status.isLoading && !status.errorMsg) {
      load();
    }
  }, [loader]);

  
  return page;
};
