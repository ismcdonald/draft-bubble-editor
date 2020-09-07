import * as React from 'react'
import {useState} from 'react'
import {Editor, EditorState, DraftEditorCommand, ContentState, convertToRaw, RichUtils, DraftHandleValue, ContentBlock} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useCurrentPage } from '../../model/ps/usePageLoader';
import { docToDraft, draftToDoc , parseHeader, toContentType, isHeader } from '../../model/doc/draft-to-doc';
import { showContent } from '../../model/doc/draft-util';
import EditorBlockMap, { myBlockRenderer } from '../../model/doc/view/EditorBlockMap';

import { setHeader, updateContent, removeSel } from '../../model/doc/doc-actions';

var count = 1;


const doSerialize = (editorState:EditorState):string[] => {
  count++;
  var doc = draftToDoc( editorState)
  //var content = editorState.getCurrentContent()
  //var out = convertToRaw(content)
  //var json = JSON.stringify(out, null, 2)
  //console.log('----')

  var json = JSON.stringify(doc, null, 2)
  console.log(json);
  return json.split('\n')
  //return `${count} \n ${JSON.stringify(doc, null, 2)} \n ---- \n ${showContent(editorState.getCurrentContent())}`
}

const DocEditor = ()  => {
  var editorState:any;
  var setEditorState:any;

  const page = useCurrentPage();


  ([editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  )); 

  React.useEffect(() => {
    if (page.data.doc) {
       var state = docToDraft(page.data.doc)
       setEditorState(state)
    }
  }, [page.data.doc])



  const [serialized, setSerialized] = useState([""])

    
  //var editorState = docToDraft(page.data.doc)

  const onChange = (state:any) => {
    if (state !== editorState) {
      setEditorState(state)
    }
  }

 const handleKeyCommand = (command:DraftEditorCommand, editorState:EditorState):DraftHandleValue =>  {
  if (command == "split-block") { 
    showContent(editorState.getCurrentContent())
 
  }
  const newState = RichUtils.handleKeyCommand(editorState, command);
  
  
  if (newState) {  
    //showContent(newState.getCurrentContent())

    onChange(newState);
    return 'handled';
  }
  return 'not-handled';
  }


  const focus= () =>  {  
    // this.refs.editor.focus();   
  } 
  // -- on tab, set or remove block
  const onTab = (e:any) => {

    e.preventDefault()


    var content = editorState.getCurrentContent();
    var newContent = setHeader(editorState, !e.shiftKey)
    if (newContent !==  content) {
      var newEditorState = updateContent(editorState, newContent)
      onChange(removeSel(newEditorState))
    }

    //const maxDepth = 4;
   //onChange(RichUtils.onTab(e, editorState, maxDepth));
  }
 
  return (
    <div>
  
      <a onClick={() => setSerialized(doSerialize(editorState))}>serialize</a>
      <h1>doc</h1>
      <div className = "RichEditor-editor"
        onClick={focus}>

        <Editor 
          editorState={editorState} 
          blockRenderMap={EditorBlockMap}
          blockRendererFn={myBlockRenderer}
          blockStyleFn={getBlockStyle}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          onTab={onTab}
          placeholder="Tell a story..." />
      </div>

    
    <div>


      <h2>serialized</h2>
      <textarea>
      {(serialized! || []).join("\n")}

      </textarea> 
    </div>
      
  </div>)
}


//             


function getBlockStyle(block:ContentBlock) {
  console.log(`--- rendering ${block.getType()}`)

  switch (block.getType()) {
    

    case 'blockquote':
         return 'RichEditor-blockquote';
    case 'header-two':
      return "h2"
    case "paragraph":
      return "p"
    default:
       return "p";
  }

  
}  
export default DocEditor