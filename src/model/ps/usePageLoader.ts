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

export const usePage = (url: string) => {
  return useSelector((s: State) => getPageStatus(s.app, url));
};

export const useCurrentPage = ():PageState<any,any> => {
  return useSelector((s:State) => {
    return s.app.page}
     ) as PageState<any,any>
}

/**
 * Page loader
 *   Given an rurl (ie 'project/user/project-name'),
 *   - via readux, queries the model for a resource descriptor
 * @param url
 * @param dispatch
 */
export const usePageLoader = () => {
  const page = useCurrentPage()

  //const page: PageState<any,any> = usePage(url);
  const dispatch = useDispatch()

  let {status} = page
  const loader = useCallback(createResourceLoader(status.fullURL!), [status]);


  useEffect(() => {
    const load = async () => {
      try {
        dispatch({ type: "LoadStart", page });
        const result = await loader();
        dispatch({ type: "LoadComplete", page, data: result.data });
      } catch (e) {
        dispatch({ type: "LoadError", page, e });
      }
    };
    let {status} = page;
    if (status.fullURL && !status.isReady && !status.isLoading && !status.errorMsg) {
      load();
    }
  }, [loader]);

  
  return page;
};
