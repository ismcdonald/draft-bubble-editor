import * as React from "react";
import { useDispatch } from "react-redux";
import { usePageLoader, useViewNav } from "../../../model/ps/usePageLoader";
import ResourceStatus from "../ResourceStatus";
import { useMemo } from "react";
import { toPages, filterPM, PagePM } from "./NotesPM";
import copy from "clipboard-copy";
import { toNoteFilterFn } from "./filter";
import { PageState } from "../../../model/resource/PageResource";
import {
  NotesFilter,
  BubbleNotes,
  BubbleNote,
  BubbleNoteOrGroup,
} from "../../../model/domain/BubbleNotes";
import Link from "redux-first-router-link";
import { actionToURI } from "../../../model/pageReducer";
import { NoteRef, Quote } from "../../../model/doc/Doc";


type Props = {
  rurl:string
  quoteFn?:any
}

// -- TODO - abstract as higher order component
const Notes = ({rurl, quoteFn}:Props) => {

  const page = usePageLoader(rurl);

  let {user,pname, ref} = page.resource.params
  
  // -- decoate our quote function to get a quote rather than a bubbl enote
  const quoteFn2 = (note:BubbleNote) => {
    
    let {did, text, pg} = note

    var noteRef:NoteRef = NoteRef(ref, user, pname, did, pg  )
    var quote:Quote = Quote(noteRef, [text])
    quoteFn(quote)
  }


  return page.data ? <NotesView page={page} quoteFn={quoteFn2}/> : <ResourceStatus page={page} />;
}; 

// -- encodes application state of node filtering

type NotesState = PageState<BubbleNotes, NotesFilter>;

interface NotesProps {
  page: NotesState;
  quoteFn?:any
}

const style = {
  background: "#F7BECA",
};

const toggleFilter = (filter: any, col: any) => {
  if (filter.col == col) {
    return { col: null };
  }
  return { col };
};

const toCpTxt = (page: NotesState, dispatch: Function) => (
  e: MouseEvent,
  note: BubbleNote,
  asQuote: boolean
) => {
  let { ref, name } = page.data!;
  var txt: string;
  let { fullURL } = page.status;
  let { rurl } = page.resource;

  if (asQuote) {
    txt = `${note.text}  ([${ref}] "${name}")`;
  } else {
    // issue: what we have is the underlying resource url  http:server/model/etc
    //   we need to construct the resource uri
    //   which is a buisness logic that belongs in the reducer

    var i = fullURL!.indexOf(`/data${rurl}`); // <-- FIX_THIS - hack. Does not belong in the view
    var base = fullURL!.substr(0, i);
    var rurl1 = `${rurl}?note=${note.did}`;
    txt = `${base}${rurl1}`;
  }

  var ok = copy(txt);

  if (!asQuote && e.shiftKey) {
    // navigate to link
    //dispatch(redirect({type:"REF", payload:{ to:txt}} )    ) /// .. {type:"NavTo", rurl:rurl1!})
    //history.push('/home?note=query', { note:note.did });
    //window.location.href = txt
    // -- Q: how to transform this

    dispatch({
      type: "REF",
      payload: page.resource.params,
      query: { note: note.did },
    }); // Q: how to add query?
  } else {
    dispatch({
      type: "Notification",
      msg: "copied quote to clipboard",
      details: txt,
    });
  }
};

const NotesView = ({ page, quoteFn }: NotesProps) => {
  let { rurl } = page.resource;
  let { filter } = page;
  //var filter:any, setFilter:any;
  //([filter, setFilter] = useState({col:null}));
  const dispatch = useDispatch();

  let data: BubbleNotes = page.data!;

  let { ref, name, notes, notesAuth } = data;
  var pagePM = useMemo(() => toPages(notes), [notes]);

  const cpTxt = toCpTxt(page, dispatch);

  const filterFn = toNoteFilterFn(filter!);
  const pages = filterFn ? filterPM(pagePM, filterFn) : pagePM; // <--- could memoize
  const nav = useViewNav(rurl)

  return (
    <div className={"doc-container"}>
      <span>
        <FilterUI page={page} nav={nav}/>

        <div className={"bubble-breadcrumbs-bar"}>
          <Link to={nav("/")}>projects</Link> {" > "}
          <Link
            to={nav(`/project/${page.resource.params.user}/${page.resource.params.pname}`)}>
            {page.resource.params.pname}
          </Link>{" "}
          {" > "}
          {filterFn ? (
            <>
              <Link to={nav(page.resource.rurl)}>[{page.resource.params.ref}]</Link>{" "}
              {" > "}
              {page.filter!.note! ? " ~selection " : " ~filtered"}
            </>
          ) : (
            `[${page.resource.params.ref}]`
          )}
        </div>
          

        <h1 style={{textAlign:"center"}}>  {name} 
        {"  "}
         <span style={{fontSize:15}}>[{page.resource.params.ref}]</span> 
     
         </h1>
        {pages.map((page, i) => renderPage(page, cpTxt, quoteFn, i))}
      </span>
    </div>
  );
};

const hasCol = (filter: NotesFilter, col: string): boolean => {
  return filter && filter.col ? filter.col.indexOf(col) >= 0 : false;
};

const toFilterPM = (filter?: NotesFilter): FilterBtnPM[] => {
  var blue: boolean = hasCol(filter!, "blue");
  var yellow: boolean = hasCol(filter!, "yellow");
  var green = hasCol(filter!, "green");

  var all = !blue && !yellow && !green;

  return [
    { label: "all", v: all, ref: "all" },
    { label: "sections", v: green, ref: "green" },
    { label: "hilights", v: blue, ref: "blue" },
    { label: "references", v: yellow, ref: "yellow" },
  ];
};

const navAction = (page: NotesState, col: string, nav:any) => {
  var query = undefined;
  var { filter } = page;
  var newCol: string[];

  if (col !== "all") {
    // -- remove colour filter
    var oldCol: string[] = filter && filter.col ? filter.col! : [];

    if (hasCol(filter!, col)) {
      newCol = oldCol.filter((c) => c != col); // remove old colour
    } else {
      newCol = [...oldCol, col];
    }

    if (newCol.length > 0) query = { col: newCol.join(".") };
  } else {
    query = undefined;
  }



  var action:any = { type: "REF", payload: page.resource.params, query };
  var uri = actionToURI(action)

  return nav(uri)
};

type FilterBtnPM = { label: string; v: boolean; ref: string };

type FilterProps = {
  page: NotesState
  nav:any
}
const FilterUI = ({ page, nav }:FilterProps) => {
  
  const dispatch = useDispatch();
  const filterPM: FilterBtnPM[] = toFilterPM(page.filter);

  var last = filterPM.length - 1;
  return (
    <span className="bubble-filter-bar">
      {filterPM.map((item: FilterBtnPM, i) => (
        <span key={i}>
          <a
            className={item.v ? "bubble-filter-selected" : ""}
            onClick={(e: React.SyntheticEvent) =>
              dispatch(navAction(page, item.ref, nav ))
            }
          >
            {item.label}
          </a>
          {i != last ? " | " : ""}
        </span>
      ))}
    </span>
  );
};

const renderPage = (page: PagePM, cpTxt: any, quoteFn:any, i:any) => {
  let { pg, notes } = page;

  return (
    <div key={i} className="bubble-pg-container">
      <span className="bubble-pg">{pg}</span>
      {notes.map((note, i) => renderNote(note, cpTxt, quoteFn, i))}
    </div>
  );
};

const renderNote = (note: BubbleNoteOrGroup, cpTxt: any, quoteFn:any, i:any) =>
  note.$$ == "Group" ? (
    <div  key ={i} className="bubble-group bubble-colour-tagged">
      {renderGroup(note.nodes, cpTxt, quoteFn)}
    </div>
  ) : (
    <div  key ={i}
      className={
        "bubble-wrap" +
        (note.col == "green" ? " bubble-wrap-section-title" : "")
      }
    >
      {renderNoteOnly(note, false, false, cpTxt, quoteFn, i)}
    </div>
  );

const renderGroup = (nodes: BubbleNote[], cpTxt: any, quoteFn:any) => {
  return (
    <div className="bubble-group-inner">
      {nodes.map((note, i) =>
        renderNoteOnly(note, true, i === nodes.length - 1, cpTxt, quoteFn, i)
      )}
    </div>
  );
};

const renderNoteOnly = (
  note: BubbleNote,
  isGroup: boolean = false,
  isLast: boolean = false,
  cpTxt: any,
  quoteFn:any,
  i:any
  
) => {
  var style = `bubble ${isGroup ? "bubble-g" : ""} ${isLast ? "bubble-g-last " : ""} bubble-${note.col}`;
  return (
    <div key={i} className={style}>
      {note.text}
      {"    "}
      {quoteFn &&  <>
        <a className="bubble-action" onClick={(e) => quoteFn(note)}>
        (quote)
        </a>
        {" "}
      </>
      }

      <a className="bubble-action" onClick={(e) => cpTxt(e, note, true)}>
        (copy)
      </a>
      {!quoteFn && 
      <>
        {"  "}
        <a className="bubble-action" onClick={(e) => cpTxt(e, note, false)}>
          (link)
        </a>
      </>}
    </div>
  );
};

export default Notes;
