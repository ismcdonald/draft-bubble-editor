import { BubbleNote, NotesFilter } from "../../../model/domain/BubbleNotes"

export const toNoteFilterFn = (filter:NotesFilter) => {
  if (!filter) {
    return null
   }
   
  let {col, note, txt} = filter
  if (!col && !note && !txt) {
    return null
  }

  return (bnote:BubbleNote) => {
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