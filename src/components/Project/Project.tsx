import * as React from "react";
import { usePageLoader } from "../../model/ps/usePageLoader";
import ProjectView from "./ProjectView";
import ResourceStatus from "./ResourceStatus";

const Project = () => {

  const page = usePageLoader();
  console.log(" ---- " + page.status.isReady)
  return page.data ? (
    <ProjectView page={page} />
  ) : (
    <ResourceStatus page={page} />
  );
};

export default Project;
