import * as React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { usePageLoader } from "../../../model/ps/usePageLoader";
import ResourceStatus from "../ResourceStatus";
import { PageState } from "../../../model/model";
import { useMemo, useState } from "react";

export type BubbleNotes = {
  ref: string;
  name: string;
  notes: BubbleDoc;
};
export type BubbleDoc = {
  $$: "Doc";
  nodes: BubbleNode[];
};

export type BubbleNode = {
  $$: "Note";
  col: string;
  name: string;
  did: string;
  ref: BubbleRef;
  text: string;
  type: string;
};

export type BubbleNodeOrGroup =
  | BubbleNode
  | {
      $$: "Group";
      nodes: BubbleNode[];
    };

export type BubbleRef = {
  doc: string;
  pg: number;
};

type PagePM = {
  pg: string;
  notes: BubbleNodeOrGroup[];
};

// -- TODO - abstract as higher order component
const Notes = () => {
  const { owner, pname, ref } = useParams() as any;
  var rurl = `project/${owner}/${pname}/${ref}`; // <-- might be nice for router to calculate this
  const dispatch = useDispatch();
  const page = usePageLoader(rurl, dispatch);

  return page.data ? <NotesView page={page} /> : <ResourceStatus page={page} />;
};

interface NotesProps {
  page: PageState<BubbleNotes>;
}

const style = {
  background: "#F7BECA",
};
const NotesView = ({ page }: NotesProps) => {
  var [filter, setFilter] = useState(false);
  let data: BubbleNotes = page.data!;
  let { ref, name, notes } = data;
  var pages = useMemo(() => toPages(notes), [notes]);

  return (
    <div>
      <span>
        <h2>
          {"  "} [{ref}] {name}
        </h2>
        <h1>Bubble Notes: </h1>
        <button onClick={() => setFilter(!filter)}>
          {filter ? "do filter" : "end filter"}
        </button>
        {pages.map((page) => renderPage(page, filter))}
      </span>
    </div>
  );
};

// -- this is to quickly test the css
export const NotesTestView = ({ page }: NotesProps) => {
  let data: BubbleNotes = page.data!;
  let { ref, name, notes } = data;
  return (
    <div>
      <span>
        <h1>Bubble Notes: </h1>
        <h2>
          {"  "} [{ref}] {name}
        </h2>
        <div className="bubble-pg-container">
          <span className="bubble-pg">p100</span>
          <span>
            <div className="bubble-wrap">
              <div className="bubble">
                This is some text asodiufh adfs lkhjdfs lkjhsdf alksdjfh al
                laksjdfh dlasjh fadskljh fdsa lkjhdsf{" "}
                <a className="bubble-action">ln</a>
                {"  "}
                <a className="bubble-action">txt</a>
              </div>
            </div>
            <div className="bubble-wrap">
              <div className="bubble">This is more text </div>
            </div>
          </span>
        </div>
      </span>
    </div>
  );
};

const renderPage = (page: PagePM, filter: boolean) => {
  let { pg, notes } = page;
  
  var filterFn = (note:BubbleNodeOrGroup) => {
    if (note.$$ == "Group") {      
      
    }


  return (
    <div className="bubble-pg-container">
      <span className="bubble-pg">{pg}</span>
      <span>
        {notes.filter(notefilterCol()).map((note) => renderNote(note))}
      </span>
    </div>
  );
};

const renderNote = (note: BubbleNodeOrGroup) => (
  <div className="bubble-wrap">
    {note.$$ == "Group" ? renderGroup(note.nodes) : renderNoteOnly(note)}
  </div>
);

const renderGroup = (nodes: BubbleNode[]) => {
  return (
    <div className="bubble-colour-tagged">
      <h1>Group goes here</h1>
      {nodes.map((note) => renderNoteOnly(note))}
    </div>
  );
};
const renderNoteOnly = (note: BubbleNode) => (
  <div className="bubble">
    {note.text}
    {"  "}
    <a className="bubble-action">link</a> {"  "}
    <a className="bubble-action">txt</a>
  </div>
);

// --- presentation model ---
/**
 * presentation model for the bubble does
 *
 */

const toPages = (doc: BubbleDoc): PagePM[] => {
  var out: PagePM[] = [];
  var pg: number = -999999939; // <-- recall: page from pdf is always a non-negative integer
  var node: BubbleNodeOrGroup;
  var pNodes: BubbleNodeOrGroup[] = [];
  var nextPg;
  for (node of doc.nodes as any) {
    if (node.$$ == "Group") {
      nextPg = node.nodes[0].ref.pg;
    } else {
      nextPg = node.ref.pg;
    }

    ({ pNodes, out, pg } = updatePageGroup(out, pNodes, pg, nextPg));

    pNodes.push(node);
  }

  if (pNodes.length > 0) {
    out.push(toPM(pg, pNodes));
  }

  return out;
};

const updatePageGroup = (out: any[], pNodes: any[], pg: any, newPg: any) => {
  if (pg != newPg) {
    if (pNodes.length > 0) {
      out.push(toPM(pg, pNodes));
    }
    pg = newPg;
    pNodes = [];
  }
  return { pNodes, out, pg };
};

const toPM = (pg: number, notes: BubbleNodeOrGroup[]) => ({
  pg: `p${pg}`,
  notes,
});

// -- filter functionality

export default Notes;
