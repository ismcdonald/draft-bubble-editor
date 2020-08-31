





export type BubbleNotes = {
  ref: string;
  name: string;
  notes: BubbleDoc;
  notesAuth?:string   // cf owner annotations   ref -- name  __ authors  .auth.docx  
};

export type BubbleDoc = {
  $$: "Doc";
  title: string;
  nodes: BubbleNoteOrGroup[];
};

export type BubbleNote = {
  $$: "Note";
  col: string;
  did: string;
  //ref?: BubbleRef;
  pg?:number;
  text: string;
  type: string;
};

export type BubbleNoteOrGroup =
  | BubbleNote
  | {
      $$: "Group";
      nodes: BubbleNote[];
    };

export type BubbleRef = {
  doc: string;
  pg: number;
};


// -- this is resource view


// documents view state
export interface  NotesFilter {
  col?:string[]
  note?:string[]
  txt?:string
}

/**
 * 
 * Takes the raw query ie  ?col=blue+red&note=asdfwtgad  
 *  
 * 
 */
export const toNoteFilter = (query:any):NotesFilter => {

  const col = ((query && query.col) ? (query.col as string) : "").split('.').filter(strEmpty);
  const note:any = query.note as string || undefined

  const txt:any = query.txt || undefined
  return {
    note:(note ? [note] : undefined),
    col:(col.length > 0 ? col : undefined),
    txt 
  }
}

const strEmpty = (s:string) => (s != null && s != '')

