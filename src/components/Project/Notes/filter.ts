import { isSection } from './navAction';
import { BubbleNote, NotesFilter } from "../../../model/domain/BubbleNotes"


export const SECTION = "green"

const hasSection = (filter:NotesFilter) => (filter.col && filter.col.indexOf(SECTION) >= 0 && filter.sel &&filter.sel.length>0)


export const toNoteFilterFn = (filter:NotesFilter) => {
  if (!filter) {
    return null
   }
   
  let {col, sel, note, txt} = filter

  if (!col && !note && !txt) {  // <-- selection only invokde when col invokes sections
    return null 
  }
  
  var hasSel = hasSection(filter)


  return (bnote:BubbleNote) => {

    if (hasSel) {
      if (bnote.col == SECTION) return true // <-- 
      if (sel!.indexOf((bnote as any).section) < 0)  {  // <-- FIX_THIS section to be function of pmodel annotation 
        return false
      } else {
        return true   // <-- disables the 
      }
    }

    if (col) {
      if (!bnote.col) return false
      if (col.indexOf(bnote.col)  < 0 ) return false
    }
   
    if (note && note.indexOf(bnote.did) < 0) {
      return false
    }
    if (txt && bnote.text && (bnote.text.indexOf(txt) < 0)) return false
    return true
  }
 
}