import { docToAnn } from './../page-annotation';
import { PageState } from './../../resource/PageResource';
import { addAnnotation } from './../quote-model';
import { updateContent } from './../doc-actions';
import { NoteRef, DocContent } from './../Doc';
import { EditorState, ContentBlock, Modifier } from 'draft-js';
import { getBlockSel } from '../doc-util';
import { OrderedMap } from 'immutable'
import { bq, blockToContent } from '../draft-to-doc';
import { showContent } from '../draft-util';

export const DOC_ADD_REF:string = "DOC_ADD_REF"

export const AddRef = () => {

  return {type:DOC_ADD_REF, payload:{

  }}
}


/**
 * 
 * 
 * @param state 
 * @param ref 
 */
export const addContent = (state:EditorState, doc:DocContent, page:PageState<any,any>) => {

  //let {ket1, key2, start, end} = toSel()
  var {ok, content,  type, txt, selection, lineSel, block,  key, start, end, isFirst, isLast } = getBlockSel(state)
  
  if (!ok) {
    return state  // <-- not going to handle the case where multiple blocks are selected
  }


if (doc.$$ == "Quote") {
  let {ref, lines} = doc 

  if (type == "Text" && isEmpty(txt)  && !isFirst) {
    // -- 1. Can just replace a text block if:
    //    - it's empty
    //    - it isn't the first block (title)
    var prevBlock:ContentBlock = content.getBlockBefore(key)
    showContent(content)    
    content = Modifier.replaceText(content, lineSel!, lines.join("\n"));
    showContent(content)
    content = Modifier.setBlockType(content, lineSel!, bq);
    showContent(content)
    block = content.getBlockForKey(key)
    var annData = docToAnn(doc, page)
    content = addAnnotation(content,  block, doc.$$, annData)
    showContent(content)
    block = content.getBlockForKey(key)
    var data:DocContent = blockToContent(block, content)!
    console.log("data ", {data}) 


   // content = addAnnotation(content, block)
  } else  if (isLast) {
    // -- 2. if we're on the last line, insert the quote  


  } else {


  }



}
  // 4.  -- the the quote inserted is the last line, insert a blank text line 



  return updateContent(state, content);

}


var EMPTY:RegExp = /^(\s)*$/
const isEmpty = (v:string):boolean => {
  return EMPTY.test(v)
}


