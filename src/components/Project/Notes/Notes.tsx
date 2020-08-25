import * as React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { usePageLoader } from "../../../model/ps/usePageLoader";
import ResourceStatus from "../ResourceStatus";
import { PageState } from "../../../model/model";
import { useMemo, useState } from "react";
import { BubbleNotes, BubbleNote, BubbleNoteOrGroup } from "./NotesModel";
import { toPages, filterPM, PagePM } from "./NotesPM";
import copy from 'clipboard-copy'

// -- TODO - abstract as higher order component
const Notes = () => {
  const { owner, pname, ref } = useParams() as any;
  var rurl = `project/${owner}/${pname}/${ref}`; // <-- might be nice for router to calculate this
  const dispatch = useDispatch();
  const page = usePageLoader(rurl, dispatch);
  console.log(" page ?", {page})

  return page.data ? <NotesView page={page} rurl={rurl} /> : <ResourceStatus page={page}  />;
};

interface NotesProps {
  page: PageState<BubbleNotes>;
  rurl: string
}

const style = {
  background: "#F7BECA",
};

const toggleFilter = (filter:any, col:any) => {
  if (filter.col == col) {
    return {col:null}
  } 
  return {col}
}



const toCpTxt = (page:PageState<BubbleNotes>, dispatch:Function) =>  (note:BubbleNote, asQuote:boolean) => {
  
  let {ref, name} = page.data!
  var txt:string
  
  if (asQuote) {
    txt = `${note.text}  ([${ref}] "${name}")`
  } else {
    txt = page.url + `?d=${note.did}`
  }
  // not sure if this is using the modern api
  //see: https://developers.google.com/web/updates/2018/03/clipboardapi
  
  var ok = copy(txt)
  dispatch({type:"Notification", msg:"copied quote to clipboard", details:txt})

}



const NotesView = ({ page, rurl }: NotesProps) => {
  var filter:any, setFilter:any;
  ([filter, setFilter] = useState({col:null}));
  const dispatch = useDispatch();

  let data: BubbleNotes = page.data!;
  let { ref, name, notes } = data;
  var pages = useMemo(() => toPages(notes), [notes]);

  if (filter && filter.col != null) {
    var filterFn = (node: BubbleNote): boolean => {
      return node.col === filter.col;
    };
    pages = filterPM(pages, filterFn);
  }


  const cpTxt = toCpTxt(page, dispatch)

  return (
    <div>
      <span>
        <h2>
          {"  "} [{ref}] {name}
        </h2>
        <h1>Bubble Notes: </h1>
        <button onClick={() =>setFilter(toggleFilter(filter, "blue"))}>
          {filter.col =="blue" ? "-blue" : "+blue"}
        </button>
        <button onClick={() => setFilter(toggleFilter(filter, "yellow"))}>
          {filter.col == "yellow" ? "-yellow" : " +Yellow"}
        </button> 
        {pages.map((page) => renderPage(page, filter, cpTxt))}
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
            <div className="bubble-wrap">
              <div className="bubble">
                This is some text asodiufh adfs lkhjdfs lkjhsdf alksdjfh al
                laksjdfh dlasjh fadskljh fdsa lkjhdsf{" "}
                <a className="bubble-action"  >ln</a>
                {"  "}
                <a className="bubble-action">txt</a>
              </div>
            </div>
            <div className="bubble-wrap">
              <div className="bubble">This is more text </div>
            </div>
        </div>
      </span>
    </div>
  );
};

const renderPage = (page: PagePM, filter: boolean, cpTxt:any) => {
  let { pg, notes } = page;

  return (
    <div className="bubble-pg-container">
      <span className="bubble-pg">{pg}</span>
      {notes.map((note) => renderNote(note, cpTxt))}
    </div>
  );
};

const renderNote = (note: BubbleNoteOrGroup, cpTxt:any) => (
  note.$$ == "Group" ? 
  <div className="bubble-group bubble-colour-tagged" >
    {renderGroup(note.nodes, cpTxt) }
  </div> 
:
  <div className="bubble-wrap">
    {renderNoteOnly(note, false, false, cpTxt)}
  </div>
);

const renderGroup = (nodes: BubbleNote[],cpTxt:any) => {
  return (
  <div className="bubble-group-inner">
    
      {nodes.map((note, i) => renderNoteOnly(note, true,  i === nodes.length -1, cpTxt))}
    </div>
  );
};

const renderNoteOnly = (note: BubbleNote, isGroup:boolean = false, isLast:boolean = false , cpTxt:any) => {

 var style = `bubble ${isGroup ? "bubble-g" : ""} ${isLast ? "bubble-g-last ": ""} bubble-${note.col}`
  return  <div className={style}>
    {note.text}  
    {"    "}
    <a className="bubble-action" onClick={() => cpTxt(note, true)}>(link)</a> {"  "}
    <a className="bubble-action" onClick={() => cpTxt(note, false)}>(txt)</a>{" "}

  </div>
}

export default Notes;
