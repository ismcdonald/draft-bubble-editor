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
import { addQuote } from '../../model/doc/actions/AddQuote';
import { Quote, Doc } from '../../model/doc/Doc';
import { PageState } from '../../model/resource/PageResource';
import { SecondPage } from './SecondPages';
import assert from '../../model/util/assert';
import HomeIcon from '@material-ui/icons/Home';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { useDispatch } from 'react-redux';

import Link from 'redux-first-router-link'





// -- mechanim to persist unsaved data in the view 
//  (to avoid an invocation of the reducer)
//  -- latest state in editor
const _globalState:{[rurl:string]:EditorState}= {}
// latest state generated from saved
const _globalBaseState:{[rurl:string]:EditorState}= {}
// last doc recieved from model form whch saved was generated from 
const _globalDoc:{[rurl:string]:Doc}= {}



const DocEditor = ()  => {
  var editorState:EditorState;
  var setEditorState0:any;
  const pageURI = useCurrentPage()
  const page:PageState<any,any> = usePageLoader(pageURI);
  const dispatch = useDispatch();
  
  const {showView} = page.filter; 

  console.log(`+++ got showview : ${showView}`);
  ([editorState, setEditorState0] = React.useState(  () => EditorState.createEmpty())); 
  let [requiresSave, setRequireSave] = useState(false)

  const setEditorState = (state:EditorState) => {
 
    _globalState[pageURI] = state  // <-- cache in case we navigage away
    var requiresSave = (state.getCurrentContent() !== _globalBaseState[pageURI].getCurrentContent())
    setEditorState0(state)
    setRequireSave(requiresSave)

  }


  React.useEffect(() => {
    if (page.data.doc) {
      const doc = page.data.doc
      var state

      // -- retrieve from cache 
      if (_globalDoc[pageURI] == doc) {
        state = _globalState[pageURI]  // <-- last state, not necessarily saved
        setEditorState(state)
      } else {

        state = docToDraft(page.data.doc, page)
        showContent(state.getCurrentContent())
       _globalDoc[pageURI] =  page.data.doc
       _globalBaseState[pageURI] = state
        setEditorState(state)
      }
    }
  }, [page.data.doc])





  const [saveInProgress, setSaveInProgress] = useState(false);
    
  //var editorState = docToDraft(page.data.doc)

  const doSave = ()  => {
    if (_globalBaseState[pageURI].getCurrentContent()  !== editorState.getCurrentContent()) {
      
      // -- TODO - invoke actual save process here 
     // _globalBaseState[pageURI] = editorState  // <-- fakes a save at the model level 
      
      // -- round trip serialization ... make sure it works
      var doc = draftToDoc(editorState)
      dispatch({type:"SET_DOC", rurl:pageURI, doc})




    }
  }

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

    if (e.altKey) {
      doSave()
      return 
    } 

    var content = editorState.getCurrentContent();
    var newContent = setHeader(editorState, !e.shiftKey)
    if (newContent !==  content) {
      var newEditorState = updateContent(editorState, newContent)
      onChange(removeSel(newEditorState))
    } else {
      if (e.shiftKey) {
        let {type, params:payload} = page.resource
        var view = page.links.view
        let showView = !(page.filter.showView)
        let query = {showView, view } 
        type = type.toUpperCase()
        console.log(" == toggle show " + showView)
        dispatch({type, payload, query})
      }

    }

    //const maxDepth = 4;
   //onChange(RichUtils.onTab(e, editorState, maxDepth));
  }
 

  let {links} = page
  var viewURL = links.view ? links.view : links.project;
  assert(viewURL != null)

  
  const quoteFn = (quote:Quote) => {
    var state = addQuote(editorState, quote, page)
    setEditorState(state)
  }



  return (
    <Grid>
      <Row>


      <Col xs={showView ? 6: 12}>

      <div className={"bubble-breadcrumbs-bar"}>

      <Link to="/">
        <HomeIcon  />
       </Link>

         
          <a  onClick={doSave}  className={requiresSave ? "bubble-filter-selected" : ""} style={{float:"right"}}> 
          {requiresSave ? "save" : "-"}</a>
        
       

            
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
{ showView && 
      <Col xs={6 } >
      <div className="doc-container">
          <SecondPage rurl={viewURL} quoteFn={quoteFn} />
      </div>
    
     </Col>
}


  
       



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





export default DocEditor//