import * as React from "react";
import { useMemo } from "react";
import { toFolders } from "./toFolders";
import { PageState } from "../../model/resource/PageResource";
import { ProjectData } from "../../model/domain/Project";

import Link from 'redux-first-router-link'
import { useViewNav } from "../../model/ps/usePageLoader";
import HomeIcon from '@material-ui/icons/Home';




export type ProjectFilter = {

} 
type Props = { 
  page: PageState<ProjectData, ProjectFilter> ,
}



/**
 * A completely pure renderer of page state ...
 *
 */
const ProjectView = ({ page }:Props) => {

  const nav = useViewNav(page.resource.rurl)

  const { folders, project } = useMemo(() => toFolders(page.data!, page.resource.rurl), [page]);

  return (
    <div>
      <div className={"bubble-breadcrumbs-bar"}>
      <Link to={nav("/")}>
        <HomeIcon  />
       </Link>

      <Link to={nav("/")}>projects</Link> {" > "} {page.resource.params.pname}
      </div>
      <h1>Project: "{page.resource.params.pname}" </h1>
      {render(folders, nav)}
    </div>
  );
};

const render = (folders: any[], nav:any) => {
  return (
    <div>
      {folders.map((p, i) => (
        <div key={i}>
          <Spacer />
          <ColoredLine color="#340410" />
          {p.path ? <h2>{p.path}</h2> : null}
          {p.items.map((item: any, i:any) => citation(item, nav, i))}
        </div>
      ))}
    </div>
  );
};

const hasRef = (ref:any) => (ref && ref.indexOf('_') < 0)

const citation = ({ ref, link, name, authors }: any, nav:any, i:any) => {
  return (
    <div key={i}>
      {"["}
      {hasRef(ref)  ? <Link to={nav(link)}>{ref}</Link> : <span>{ref}</span>}
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
      {authors.map((v, i) => (
        <span key={i}>
          <a >{v}</a>
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
