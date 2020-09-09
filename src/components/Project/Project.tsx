import * as React from "react";
import { usePageLoader, useViewNav } from "../../model/ps/usePageLoader";
import ProjectView from "./ProjectView";
import ResourceStatus from "./ResourceStatus";

type Props =  {
  rurl:string
}


const Project = ({rurl}:Props) => {
  const page = usePageLoader(rurl) ;

  console.log(" ---- " + page.status.isReady)
  return page.data ? (
    <ProjectView page={page}  />
  ) : (
    <ResourceStatus page={page} />
  );
};  

export default Project;
