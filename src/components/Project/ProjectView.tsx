import * as React from "react";
import { useMemo } from "react";
import { toFolders } from "./toFolders";
import { PageState } from "../../model/resource/PageResource";
import { ProjectData } from "../../model/domain /Project";

import Link from 'redux-first-router-link'




export type ProjectFilter = {

} 


/**
 * A completely pure renderer of page state ...
 *
 */
const ProjectView = ({ page }: { page: PageState<ProjectData, ProjectFilter> }) => {
  

  const { folders, project } = useMemo(() => toFolders(page.data!, page.resource.rurl), [page]);

  return (
    <div>
    <Link to={"/"}>projects</Link> {" > "} {page.resource.params.pname}
      <h1>Project: "{page.resource.params.pname}" </h1>
      {render(folders)}
    </div>
  );
};

const render = (folders: any[]) => {
  return (
    <div>
      {folders.map((p) => (
        <div>
          <Spacer />
          <ColoredLine color="#340410" />
          {p.path ? <h2>{p.path}</h2> : null}
          {p.items.map((item: any) => citation(item))}
        </div>
      ))}
    </div>
  );
};

const citation = ({ ref, link, name, authors }: any) => {
  return (
    <div>
      {"["}
      {ref !== null ? <Link to={link}>{ref}</Link> : <span>{ref}</span>}
      {']  "'}

      <span>{name}</span>
      {'"  '}
      {renderAuthors(authors)}
    </div>
  );
};

const renderAuthors = (authors: string[] = []) => {
  return (
    <span>
      {authors.map((v) => (
        <span>
          <a href="temp">{v}</a>
          {" ; "}
        </span>
      ))}
    </span>
  );
};

const ColoredLine = ({ color }: { color: any }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 1,
    }}
  />
);

const Spacer = () => <div style={{ height: "30px" }}></div>;

// https://typespiration.com/design/love-story/

export default ProjectView;
