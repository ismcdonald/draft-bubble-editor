import * as React from "react";
import { useDispatch } from "react-redux";
import { usePageLoader, useViewNav } from "../../../model/ps/usePageLoader";
import ResourceStatus from "../ResourceStatus";
import { useMemo } from "react";
import { toPages,  PagePM, NotesState } from "./NotesPM";
import {filterPM } from "./FilterPM"
import {FilterUI} from "./FilterUI"
import copy from "clipboard-copy";
import { toNoteFilterFn } from "./filter";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import {
  BubbleNotes,
  BubbleNote,
  BubbleNoteOrGroup,
} from "../../../model/domain/BubbleNotes";
import Link from "redux-first-router-link";
import { actionToURI } from "../../../model/pageReducer";
import { NoteRef, Quote } from "../../../model/doc/Doc";
import { navAction, navSearch, navSection } from "./navAction";


type Props = {
  rurl:string
  quoteFn?:any
}

// -- TODO - abstract as higher order component
const Notes = ({rurl, quoteFn}:Props) => {

  const page = usePageLoader(rurl);

  let {user,pname, ref} = page.resource.params
  
  // -- decoate our quote function to get a quote rather than a bubbl enote
  const quoteFn2 = quoteFn ? (note:BubbleNote) => {
    
    let {did, text, pg} = note

    var noteRef:NoteRef = NoteRef(ref, user, pname, did, pg  )
    var quote:Quote = Quote(noteRef, [text], note.section)
    quoteFn(quote)  
  } : null


  return page.data ? <NotesView page={page} quoteFn={quoteFn2}/> : <ResourceStatus page={page} />;
}; 

// -- encodes application state of node filtering


interface NotesProps {
  page: NotesState;
  quoteFn?:any
}

const style = {
  background: "#F7BECA",
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
  let { rurl, params } = page.resource;
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
  const navAct = navAction;
  const navSect = navSection(page, nav)  // <-- logic to create actions to select view 


  const isSec = (note:BubbleNote) => {
    return filter && filter.sel && (filter.sel.indexOf(note.did) >= 0)
  }

  const isSel = (note:BubbleNote) => {
    var ok = filter && filter.select && note.did == filter.select
    if (ok) {
      console.log('x')
    }
    return ok
  }

  const onSearch = (txt:string) => {
    dispatch(navSearch(page, txt, nav))
  }


  const onClearSearch = (e:any) => {
    dispatch(navSearch(page, "", nav))
  }


  return (
    <div className={"doc-container"}>
      <span>
        <FilterUI page={page} nav={nav} navAction={navAct}/>

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
        <div style={{height:120}}>
          <img style={{width:75, height:100,  marginBottom:0,
              marginRight:10,
              float:"left", borderRadius:"5" }} 
              src={`/data/project/${params.user}/${params.pname}/__img_s/${params.ref}.png`}/>




          <h1 style={{textAlign:"center"}}>  {name} 
          {"  "}
          <span style={{fontSize:15}}>[{page.resource.params.ref}]</span> 
      
          </h1>
        </div>
        {pages.map((page, i) => renderPage(page, cpTxt, quoteFn, navSect,  isSec, isSel, i))}
      </span>
    </div>
  );
};







const renderPage = (page: PagePM, cpTxt: any, quoteFn:any, navSection:any, isSec:any, isSel:any,i:any) => {
  let { pg, notes } = page;

  return (
    <div key={i} className="bubble-pg-container">
      <span className="bubble-pg">{pg}</span>
      {notes.map((note, i) => renderNote(note, cpTxt, quoteFn, navSection, isSec, isSel, i))}
    </div>
  );
};

const renderNote = (note: BubbleNoteOrGroup, cpTxt: any, quoteFn:any, navSection:any, isSec:any, isSel:any, i:any) =>
  note.$$ == "Group" ? (
    <div  key ={i} className="bubble-group bubble-colour-tagged">
      {renderGroup(note.nodes, cpTxt, quoteFn, navSection, isSec, isSel )}
    </div>
  ) : (
    <div  key ={i}
      className={
        "bubble-wrap" +
        (note.col == "green" ? " bubble-wrap-section-title" : "")
      }
    >
      {renderNoteLeaf(note, false, false, cpTxt, quoteFn,navSection, isSec, isSel,i)}
    </div>
  );

const renderGroup = (nodes: BubbleNote[], cpTxt: any, quoteFn:any, navSection:any, isSec:any, isSel:any) => {
  return (
    <div className="bubble-group-inner">
      {nodes.map((note, i) =>
        renderNoteLeaf(note, true, i === nodes.length - 1, cpTxt, quoteFn,navSection, isSec, isSel,  i)
      )}
    </div>
  );
};

const renderNoteLeaf = (
  note: BubbleNote,
  isGroup: boolean = false,
  isLast: boolean = false,
  cpTxt: any,
  quoteFn:any,
  navSection:any,
  isSec:any,
  isSel:any,
  i:any
   
) => {
  var style = `bubble ${isGroup ? "bubble-g" : ""} ${isLast ? "bubble-g-last " : ""} bubble-${note.col}`;

  var isSection = (note.col == "green")
  var isSelection = isSel(note)
  if (isSelection) {
    style += " bubble-selected-did";
  }

  return (

    <div key ={i} className={style}>

      {isSection ? (!isSec(note) ?
        (<Link to={navSection(note, true)} >
          <AddCircleOutlineIcon style={{color:"#340410", paddingTop:6}} /> 
        </Link>) : 
        (<Link to={navSection(note, false)}>
          <RemoveCircleOutlineIcon style={{color:"#340410", paddingTop:6}}  />
        </Link>) )
         : null}

 
      {isSelection ? 
          (<span className="bubble-select-did">{note.text}</span>)
          :
          note.text
      }

      {"    "}
      {quoteFn &&  <>
        <a className="bubble-action" onClick={(e) => quoteFn(note)}>
          (quote)
        </a>
        {" "}
      </>
      }

      <a className="bubble-action" onClick={(e) => cpTxt(e, note, true)}>
         {quoteFn ? " |  " : ""} (copy)
      </a>
      
      {!quoteFn && 
        <>
        {"  |  "}
        <a className="bubble-action" onClick={(e) => cpTxt(e, note, false)}>
          (link)
        </a>
      </>}
    </div>
  );
};


type SearhBarProps = {
  txt:string
  onSearch:any
  onClear:any
}

const SearchBar = ({txt,onSearch, onClear}:SearhBarProps) => {
  const BarStyling = {width:300,background:"#ffffff", border:"none", padding:"0.5rem", marginRight:20};
  
  var [searchTxt, setSearchTxt] = React.useState("");


  React.useEffect(() => {
    if (txt != searchTxt) {
      setSearchTxt(txt)
    }
  },[txt])

  const onChange = (e:any) => {
    var txt = e.target.value;
     setSearchTxt(txt)
  }

  return (
    <div style={{marginBottom:15}}>
      <input 
      style={BarStyling}
      key="random1"
      value={searchTxt}
      placeholder={"...search"}
      onChange={onChange}
      />

      <a onClick={(e:any) => onSearch(searchTxt)}>search</a> <a onClick={onClear}>clear</a>
    </div>

  );
}


export default Notes;
//<div>

//<SearchBar txt={filter.txt!} onSearch={onSearch}  onClear={onClearSearch}/>
//</div>
