import { uriToAction, actionToURI } from './../../../model/pageReducer';
import { BubbleNote, filterToQuery } from './../../../model/domain/BubbleNotes';
import { hasCol } from './FilterPM';
import {NotesState} from "./NotesPM"
import assert from '../../../model/util/assert';


export const navSection = (page:NotesState, nav:any) => {

  var { filter, resource } = page;
  if (!resource) {
    console.log('BUG')
  }
  var baseAction = uriToAction(resource.rurl)

  return (note:BubbleNote, open:boolean) => {
    assert(isSection(note))
    let {did} = note;
    var newFilter = filter || {};
    var sel:string[] = newFilter.sel || [];
    if (open && (sel.indexOf(did) < 0)) {
      sel = sel.map((v:string) => (v))
      sel.push(did)
    } else if (!open) {
      sel = sel.filter( (v:string) => (v != did))
    } 
   

    var query = { 
      col:"green",            // <-- hard coding sections filter  TODO - abstract, remove duplication
      sel:sel.join(".")
    }
    if (nav) {
      //throw "TODO - support nav"

    } 
 
    var action = {...baseAction, query}
    var rurl = actionToURI(action)
      return nav(rurl)

    

  }


}

export const isSection = (note:BubbleNote):boolean => {
  return note.col == "green"
}

export const navAction = (page: NotesState, col: string, nav:any) => {
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

 export const navSearch = (page:NotesState, txt:string, nav:any) => {
  var query = undefined;
  var { filter:f } = page;


  if (txt != f.txt) {
    var query:any = filterToQuery(f);
    query = {...query, txt: txt || ""} 
    var action:any = { type: "REF", payload: page.resource.params, query };
    var uri = actionToURI(action)
    console.log(uri)
    return nav(uri)
  
  }


 }


