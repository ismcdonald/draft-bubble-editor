import {  createPageResource , setPage } from './resource/PageResource';
import { Model } from './model'

import { NOT_FOUND } from "redux-first-router"


export const routesMap = {
  HOME: '/',
  USER: '/user/:userid',
  PROJECT: '/project/:user/:pname',
  REF: '/project/:user/:pname/:ref',
 // [NOT_FOUND]: '404'
}



export const pageReducer = (state:Model, action:any = {}) => {
  if (routesMap.hasOwnProperty(action.type)) {
   
    let {type, payload, meta} = action
    let {query, pathname:rurl} =  meta.location.current
    
    console.log("--- nav to : " + action.type)
    console.log('x')
  

    var page = createPageResource(state, type, rurl, payload, query)
    state = setPage(state, page)
    
    return {...state, page}
    
  }  
  
  return state
}



