import * as React from 'react'
import {useState} from 'react'
import {Editor, EditorState, DraftEditorCommand, ContentState, convertToRaw, RichUtils, DraftHandleValue, ContentBlock} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './editor-tweaks.css'
import { useCurrentPage, usePageLoader } from '../../model/ps/usePageLoader';
import { docToDraft, draftToDoc  } from '../../model/doc/draft-to-doc';
import { showContent } from '../../model/doc/draft-util';
import EditorBlockMap, { myBlockRenderer } from '../../model/doc/view/EditorBlockMap';

import { setHeader, updateContent, removeSel } from '../../model/doc/doc-actions';
import { addContent } from '../../model/doc/actions/AddRef';
import { NoteRef, DocContent, Quote } from '../../model/doc/Doc';
import { PageState } from '../../model/resource/PageResource';
import { SecondPage } from './SecondPages';
import assert from '../../model/util/assert';


import { Grid, Row, Col } from 'react-flexbox-grid';






var count = 1;

const DocEditor = ()  => {
  var editorState:any;
  var setEditorState:any;
  const pageURI = useCurrentPage()
  const page:PageState<any,any> = usePageLoader(pageURI);
  var viewPage = page.links.view;
  var projectPage = page.links.project;

  ([editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  )); 

  React.useEffect(() => {
    if (page.data.doc) {
       var state = docToDraft(page.data.doc, page)
       setEditorState(state)
    }
  }, [page.data.doc])


  const doInsert = (e:any) => {
    var ref:NoteRef = NoteRef("Seagel04", "lea", "essay", "", 3)
    var quote:DocContent = Quote(ref, ["INSERTED QUOTE 1 "])

    var state = addContent(editorState, quote, page)
    setEditorState(state)

  }


  const [serialized, setSerialized] = useState([""])

    
  //var editorState = docToDraft(page.data.doc)

  const onChange = (state:any) => {
    if (state !== editorState) {
      setEditorState(state)
    }
  }

 const handleKeyCommand = (command:DraftEditorCommand, editorState:EditorState):DraftHandleValue =>  {
  if (command == "split-block") { 
    //showContent(editorState.getCurrentContent())
 
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
 

  let {links} = page
  var viewURL = links.view ? links.view : links.project;
  assert(viewURL != null)

  
  const quoteFn = (quote:Quote) => {
    console.log(`-- quoting: [${quote.ref}] ${quote.lines[0]}`)
  

    var state = addContent(editorState, quote, page)
    setEditorState(state)

  }



  return (
    <Grid>
      <Row>


      <Col xs={6}>

      <div className={"bubble-breadcrumbs-bar"}>
          <a style={{float:"right"}}> save</a>
            <a onClick={() => setSerialized(doSerialize(editorState))}>serialize</a>
            {" |  "}
            <a onClick={doInsert}>insert</a>
         </div>



      <div className = "RichEditor-editor doc-background doc-container"
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
    </Col>

      <Col xs={6 } >
      <div className="doc-container">
          <SecondPage rurl={viewURL} quoteFn={quoteFn} />
      </div>
    
     </Col>


  
       



  </Row>
 </Grid>)
}


//             


function getBlockStyle(block:ContentBlock) {
  console.log(`--- rendering ${block.getType()}`)

  switch (block.getType()) {
    

    case 'blockquote':
         return 'RichEditor-blockquote';
    case 'header-two':
      return "RichEditor-h2"
    case "paragraph":
      return "RichEditor-p"

  }
  return ""
  
}  






const doSerialize = (editorState:EditorState):string[] => {
  count++;
  var doc = draftToDoc( editorState)
  var content = editorState.getCurrentContent()
  var out = convertToRaw(content) 
  var json = JSON.stringify(out, null, 2)
  console.log('----')

  //var json = JSON.stringify(doc, null, 2)
  //console.log(json);
  return json.split('\n')
  //return `${count} \n ${JSON.stringify(doc, null, 2)} \n ---- \n ${showContent(editorState.getCurrentContent())}`
}



export default DocEditor//

//         <h2>serialized</h2>
      
          //{(serialized! || []).map((v:string) => <div>{v}</div>)}