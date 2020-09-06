import * as React from 'react'
import {useState} from 'react'
import {Editor, EditorState, ContentState, convertToRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

var count = 1;


const doSerialize = (editorState:EditorState):string => {
  count++;
  var content:ContentState = editorState.getCurrentContent()
  var data = convertToRaw(content)
  console.log({data})
  return `${count} \n ${JSON.stringify(data, null, 2)}`
}


const DocEditor = ()  => {
  var editorState:any;
  var setEditorState:any;
  ([editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  )); 

  const [serialized, setSerialized] = useState("")

  return (
    <div>
      
      <a onClick={() => setSerialized(doSerialize(editorState))}>serialize</a>
      <h1>doc</h1>
    <Editor editorState={editorState} onChange={setEditorState} />
    <div>
    <h2>serialized</h2>
    {serialized}
    </div>
    
    </div>
    )
}

export default DocEditor