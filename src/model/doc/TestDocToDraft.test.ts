import { docToDraft, draftToDoc } from './draft-to-doc';
import { Doc, Text, NoteRef, Quote } from './Doc';
import { EditorState } from 'draft-js';


const assertSerializeDeserialize = (doc0:Doc) => {

  var state:EditorState =  docToDraft(doc0)
  var doc1 = draftToDoc(state)
  expect(doc0).toEqual(doc1)
  
}


describe("Document to node serialization ", () => {
  it("should test a simple pmodel", () => {
  
    var header = Doc([  Text(["# This is a header"])  ])
    assertSerializeDeserialize(header)



    var q1 = Quote( NoteRef("ref1", "did"), ["quote goes here"])

    var docTestQuote = Doc([Text(["some text", "more text"]), q1 ])
    assertSerializeDeserialize(docTestQuote)


    var doc0 = Doc( [Text(["some text", "more text"]) ])
    assertSerializeDeserialize(doc0)


    var docQuote = Doc( [Quote(NoteRef("ref1", "did"), ["quote goes here"])])
    assertSerializeDeserialize(docQuote)



  })
})

