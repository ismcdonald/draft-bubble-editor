import * as React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { usePageLoader } from "../../model/ps/usePageLoader";
import ProjectView from "./ProjectView";
import ResourceStatus from "./ResourceStatus";

const Project = () => {
  const { owner, pname } = useParams() as any;
  var rurl = `project/${owner}/${pname}`; // <-- might be nice for router to calculate this
  const dispatch = useDispatch();
  const page = usePageLoader(rurl, dispatch);

  return page.data ? (
    <ProjectView page={page} />
  ) : (
    <ResourceStatus page={page} />
  );
};

export default Project;
