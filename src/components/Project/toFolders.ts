import { Ref } from "../../model/domain /Ref";
import { ProjectData } from "../../model/domain /Project";

const toRefLink = (ref: Ref, url: string) => {
  return `${url}/${ref.ref}`;
};

/**
 * Collects references by folder
 *
 */
export const toFolders = (data: ProjectData, url: string) => {
  var paths: { [path: string]: Ref[] } = {};
  var refs: { [ref: string]: Ref } = {};

  for (var node of data.resources) {
    let { path, ref } = node;
    if (ref) {
      refs[ref] = node;
    }
    paths[path] = paths[path] || [];
    paths[path].push(node);
  }

  var pathNames = Object.keys(paths);
  pathNames.sort();

  var out = [];
  for (var path of pathNames) {
    out.push({
      path: path,
      items: paths[path].map((o) => ({ ...o, link: toRefLink(o, url) })),
    });
  }
  return { folders: out, project: data };
};



