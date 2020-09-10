import * as React from 'react'
import {useState} from 'react'
import {Editor, EditorState, DraftEditorCommand,  ContentBlock, DraftHandleValue, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './editor-tweaks.css'
import { useCurrentPage, useParams, usePage } from '../../model/ps/usePageLoader';
import { docToDraft, draftToDoc, parseHeader  } from '../../model/doc/draft-to-doc';
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
import { FirebaseContext } from '../../firebase';





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
  const pageURI = useCurrentPage();
  const params = useParams() 
  // -- here's how we load 
  const page = usePage(pageURI)



  const { firebase, user } = React.useContext(FirebaseContext) as any;

  //const page:PageState<any,any> = usePageLoader(pageURI);
  React.useEffect(() => {
    getLink();
  }, []);

  function getLink() {
    var contentRef = firebase.db.collection("content0").doc(params.id);
    contentRef.get().then((doc:any) => {
      setContent({ ...doc.data(), id: doc.id })
    })
  }

  const setContent = (data:any) => {
    // -- deserialize 

    try {
      var doc = JSON.parse(data.docJson)
    } catch (e) {
      console.log("Failed to parse json", {data})
      throw "ERROR - failed to parse document  json"
      return
    }
    dispatch({type:"SET_DOC", rurl:pageURI, doc})

  }

  
  
  
  const dispatch = useDispatch();
  
  const {showView} = page.filter; 

  //console.log(`+++ got showview : ${showView}`);
  ([editorState, setEditorState0] = React.useState(  () => EditorState.createEmpty())); 
  let [requiresSave, setRequireSave] = useState(false)

  const setEditorState = (state:EditorState) => {
 
    _globalState[pageURI] = state  // <-- cache in case we navigage away
    var requiresSave = (state.getCurrentContent() !== _globalBaseState[pageURI].getCurrentContent())
    setEditorState0(state)
    setRequireSave(requiresSave)

  }


  React.useEffect(() => {
    if (page.data && page.data.doc) {
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
  }, [page.data])





  const [saveInProgress, setSaveInProgress] = useState(false);
    
  //var editorState = docToDraft(page.data.doc)

  const doSave = ()  => {
    if (_globalBaseState[pageURI].getCurrentContent()  !== editorState.getCurrentContent()) {
      
      // -- serialize
      var description = null
      var title = null
      var doc = draftToDoc(editorState)
      if (doc.vs.length > 0) {
        var doc1 = doc.vs[0]
        if (doc1.$$ == "Text" && doc1.lines.length > 0) {
          var line0:string  = doc1.lines[0];
          if (line0.length > 0) {

            var txt = parseHeader(doc1.lines[0]) || doc1.lines[0]  // <-- logic of the header here
            if (txt.length > 0) {
              title = txt
            }
            if (doc1.lines.length > 1) {
              var line1 = parseHeader(doc1.lines[1]) || doc1.lines[1]
              if (line1.length >0) {
                description = line1
              }
            }
          }
        }
      }
      
      var docJson = JSON.stringify(doc);
      _globalDoc[pageURI] = doc

      var contentRef = firebase.db.collection("content0").doc(params.id);
      var update:any = {docJson}
      if (description) {
        update.description = description
      }
      if (title) {
        update.title = title
      }
      setSaveInProgress(true)
      // could do this
      //dispatch({type:"SET_DOC", rurl:pageURI, doc})

      contentRef.get().then((doc:any) => {
        contentRef.update(update).then( (data:any) => {
          console.log('saved')
          // -- dispatching an event here breaks
          //dispatch({type:"SET_DOC", rurl:pageURI, doc:null})
          _globalBaseState[pageURI] = editorState
          setSaveInProgress(false)

        })
        .catch((error:any) => {
          console.log(' failed  to save ' + pageURI, {error})
        })
      })

      return () => {
        throw "need to do cleanup on firebase process"
      }
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
      <Row  >


      <Col xs={showView ? 6: 12}>

      <div className={"bubble-breadcrumbs-bar"}>

        <Link to="/">
          <HomeIcon  />
        </Link> {">"}
        <Link to={"/docs/lea/all"}>docs</Link> {" > "} 

        <div style={{float:"right"}}>
        <a  onClick={doSave}  className={requiresSave ? "bubble-filter-selected" : ""} > 
          {requiresSave ? "save" : ". "}</a>
        {saveInProgress ? "..." : "   "}

        </div>
        


       

            
         </div>



      <div className = "RichEditor-editor doc-background doc-container"
        onClick={focus}>
        
        <Editor 
          readOnly={saveInProgress}
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
  //console.log(`--- rendering ${block.getType()}`)

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





export default DocEditor