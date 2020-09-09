/**
 * 
 * Model for documents authored in the context of 
 *
 * //data Text = Text text:string[]    <--  first instance, no internal structure or parsing
 * data NoteRef = Ref project:string did:string
 * data DocContent ref text = Text lines:text | Quote lines:text .ref 
 * 
 * type Doc =  Doc vs:(DocContent Text)[] 
 * 
 */



export type Text = {
  $$:"Text"
  lines:string[]
}

export type NoteRef = {   
  $$:"NoteRef"
  ref:string,
  user:string,   // <-- TODO name these after the labels in the uri 
  project:string
  did?:string
  pg?:number
} 

export type Quote = {
  $$:"Quote",
  ref:NoteRef
  lines:string[]
}

export type DocContent = Text | Quote

export type Doc = {
  $$:"Doc"
  vs:DocContent[]
}
 

export const Text = (lines:string[]):Text => ({$$:"Text", lines})
export const NoteRef = (ref:string, user:string, project:string, did:string, pg?:number):NoteRef => ({$$:"NoteRef", ref, project, user, did, pg});
export const Quote = (ref:NoteRef, lines:string[]):Quote => ({$$:"Quote", ref, lines});
export const Doc = (vs:(Text | Quote)[]):Doc => ({$$:"Doc", vs})



// -- for testing 

var ref1 = NoteRef("Frankland10", "lea", "essay", "", 3)
var ref2 = NoteRef("Karen90", "lea", "essay", "", 7)


export const testDocs = {


  text: Doc([Text(["# This is ","Some text"])]),
  quote:Doc([Text(["text"]), Quote(ref1, ["A quote from Refernce one"])  ]),
  quote2:Doc([
             Text(["# Some longe textr", "more text"]), 
             Quote(ref1, ["A Fake quote from Refernce one"]),
             Text(["# 2nd header", "and more text"]), 
             Quote(ref2, ["A (fake) quote from second ref.A quote from second ref .A quote from second ref A quote from second ref.A quote from second ref"]),
            ])

  
}

const empty = Doc([Text(["doc is empty"])])


export const toTestPageData = (id:string):any => {
  var doc:any = (testDocs as any)[id]  || empty
  return { 
    doc,
    docPM:{ok:true}
  }

}