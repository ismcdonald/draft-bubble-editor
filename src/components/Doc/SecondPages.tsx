import * as React from 'react'
import {  PageState } from "../../model/resource/PageResource";
import { usePageLoader, usePage } from "../../model/ps/usePageLoader";
import ResourceStatus from "../Project/ResourceStatus";
import Link from 'redux-first-router-link'
import Project from '../Project/Project';
import Notes from '../Project/Notes/Notes';
import { Projects } from '../Projects/Projects';


export type SecondPageProps = {
  rurl:string
  quoteFn:any // <-- function to quote a text in another documentr
}

export const  SecondPage = ({rurl, quoteFn}:SecondPageProps) => {
  
  var page = usePageLoader(rurl)

  let {resource, status} = page
  let {type} = resource
  
  if (status.isReady)  {
    switch (resource.type) {
      case "home":
        return  <Projects rurl={rurl}/>
      case "project":
        return <Project rurl={rurl} />;
      case "ref":
        return <Notes rurl={rurl} quoteFn={quoteFn} />;
      default:
        return (<h1>Unsupported resource type {rurl}</h1>);
    }
  } 
  return <ResourceStatus page={page} />;
};


