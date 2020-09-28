





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

  section?:string   // <-- FIX_THIS - belong on the pmodel 

};

export type BubbleNoteOrGroup =
  | BubbleNote
  | {
      $$: "Group";
      nodes: BubbleNote[];
      section?:string   // <-- FIX_THIS - belongs on the pmodel
    };

export type BubbleRef = { // <-- deprecetae
  doc: string;
  pg: number;
};


// -- this is resource view


// documents view state
export interface  NotesFilter {
  col?:string[]
  note?:string[]
  txt?:string
  sel?:string[]
  select?:string
}


export function filterToQuery(f:NotesFilter ) {
  
  return removeNulls({
    col:cat(f.col!),
    note:cat(f.note!),
    txt:f.txt,
    sel:cat(f.sel!),
    select:f.sel
  })

}

function removeNulls(o:any):any {
  var keys = Object.keys(o)
  for (var key of keys) {
    if (o[key] === null || o[key] === undefined || o[key] == "") {
      delete o[key]
    }
  }
return o
}



function cat(vs:string[]):string | null {
  return vs ? vs.join("\.") : null
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
  const sel = ((query && query.sel) ? (query.sel as string) : "").split('.').filter(strEmpty);
  const select = query.select // <-- TODO - make array


  const txt:any = query.txt || undefined
  return {
    note:(note ? [note] : undefined),
    col:(col.length > 0 ? col : undefined),
    sel,
    txt, 
    select
  }
}

const strEmpty = (s:string) => (s != null && s != '')

