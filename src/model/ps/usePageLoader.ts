import { PageState, Model, getPageState } from "./../model";
import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

const axios = require("axios");

export const createResourceLoader = (url: string) => async () => {
  const apiData = await axios.get(url);
  console.log(apiData);
  return apiData;
};

export const usePage = (url: string) => {
  return useSelector((s: Model) => getPageState(s, url));
};

/**
 * Page loader
 *   Given an rurl (ie 'project/user/project-name'),
 *   - via readux, queries the model for a resource descriptor
 * @param url
 * @param dispatch
 */
export const usePageLoader = (url: string, dispatch: any) => {
  const page: PageState<any> = usePage(url);
  const loader = useCallback(createResourceLoader(page.fullURL), [url]);

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
    if (!page.isReady && !page.isLoading && !page.errorMsg) {
      load();
    }
  }, [loader]);
  return page;
};
