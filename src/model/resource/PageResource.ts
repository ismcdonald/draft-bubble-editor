import { toNoteFilter } from '../domain/BubbleNotes';
import { Model } from "../model"
import assert from "../util/assert";

/**
 * Contains the resource and it's interpretation.
 *  - note that type and parapms are uniquely determined by the rurl 
 *    and this type captures this interpretation
 */
export type PageResource = {
  type:string // <-- ie project, ref, user etc
  rurl:string  // resource url ie 'project/user/pname'
  params:any    // parsed from url
}

/**
 *   resources encodes  representaion of the interpretation of the resouce 
 *     in terms of  type, location and paramaterization. But not as a representations of data
 * ie.  project/name/pname/refid  
 *      ie {type:"ref", rurl:"project/name/pname/refid", params:{user:"name", pname:"pname", ref:"refid" }  }
 */
export type ResourceStatus = {
  fullURL?: string;  // 
  isLoading: boolean;
  isReady: boolean;
  errorMsg?: string[];
}

const  newStatus = (state:Model, resource:PageResource):ResourceStatus => {
  var fullURL = toFullURL(state, resource)
  return {
    fullURL, 
    isLoading:false,
    isReady: (fullURL == null)
  }
}

export type PageState<a,b> = {
  resource:PageResource  // <-- interpretation of url
  status:ResourceStatus  // <-- underlying representation of data 
  
  data?:a                // <-- the data. maybe this belons in data
                         //    (assuming a unique representation of the resouce as data)

  filter?:b    // <--  presentational transformation of the underlying data
};


export function setPage(state: Model, page: PageState<any, any>): Model {
  var resources = { ...state.resources }; // <-- slow for large numbers of resources?
  resources[page.resource.rurl] = page;
  return { ...state, resources , page};
}



export const getPageStatus = (state:Model, rurl:string) => {
  var page:PageState<any,any> = state.resources[rurl]
  return page
}

export const createPageResource = (state:Model, type:string,  rurl:string, params?:any, query?:any):PageState<any,any> => {
  //var type = rurlToType(rurl)
  
  var page0 = state.resources[rurl]
  var resource:PageResource = { type:type.toLowerCase(), rurl, params }


  var filter =  toFilter( resource, query) || {}
  if (page0) {
    var {resource:r0} = page0
    assert(eq(r0.params, resource.params) && resource.rurl === r0.rurl && resource.type === r0.type) // <-- rurl should uniquely determine this

    if (eq(filter,page0.filter)) {
      // -- i. same resources & filter, return same object
      return page0
    } else {
      // -- ii. different filter
      return {...page0, filter }
    }
  }
    // --- iii. create a page resrouces representation
  var status = newStatus(state, resource)
  return {resource, status, filter}
  
}


/**
 * simple comparison of the contents fo two objects
 */
function eq(o1:any, o2:any) {
  if (o1 === o2) {
    return true
  }
  if (o1 == null || o2 == null) {
    return false
  }
  var keys1 = Object.keys(o1)
  var keys2 = Object.keys(o2)
  if (keys1.length != keys2.length) {
    return false
  }
  for (var key of keys1) {
    if (o1[key] !== o2[key]) {
      return false
    }
  }
    
  return true
} 


const toFullURL = (state:Model, resource:PageResource) => {
  let {type, rurl} = resource
  if (["project", "ref"].indexOf(type) >= 0) {
    return `${state.config.repo}/data${rurl}/index.json` // <-- route to static data 
  } 
  return undefined
}


const validType = ["home", "project", "user" ]



const toFilter = (resource:PageResource, query?:any) => {
  var filter = undefined
  if (resource.type == "ref") {  // ie project/name/projectName?col=blue
      filter = query ? toNoteFilter(query) : null  // ie  {col=["blue", "red"], text="some search text", note=[did1, did2]}
  } 
  return filter
}




// --- status 

export const setLoading = (page:PageState<any,any>):ResourceStatus => {
  assert(!page.status.isLoading, `attempting to reload asset ${page.resource.rurl}`)
  return {   ...page.status, isLoading:true, isReady:false, errorMsg:undefined }
}

export const setReady = (page:PageState<any,any>):ResourceStatus => 
  ({  ...page.status, isLoading:false, isReady:true, errorMsg:undefined })

  export const setErr =(page:PageState<any,any>, e:Error):ResourceStatus => 
  ({...page.status, 
    isReady:false,
    isLoading:false,
    errorMsg: [
        `error loading ${page.resource.rurl}`,
        e.message || " (unknown error message)"
      ]
  })





// -- util 
const nonEmpty = (v:any) => (v != null && v !=="")