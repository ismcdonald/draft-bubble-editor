import { PageState, getPageStatus, setPage, createPageResource } from './resource/PageResource';
export type int = number;


export type Model = {
  page?: PageState<any, any>;
  resources: { [path: string]: PageState<any,any> };
  config: {
    repo: string;
    ver:number;
  };
};

export type State = {
  app:Model
}

//const repo =  
const repo =  (process.env.NODE_ENV == 'production') 
   ?  "https://kimandleabook.cafetextual.com"  
   :  "http://localhost:3000"
  
export const defaultState = (): Model => {
  const state = {
    page:null,
    resources: {},
    config: {
      repo
    },
  } as any as Model

  const page = createPageResource(state, "home", "/",{})

  var out = {...setPage(state, page), page}
  return out

}

