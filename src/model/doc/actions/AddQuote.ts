import { docToAnn } from './../page-annotation';
import { PageState } from './../../resource/PageResource';
import { addAnnotation } from './../quote-model';
import { updateContent } from './../doc-actions';
import { DocContent } from './../Doc';
import { EditorState, ContentBlock, Modifier } from 'draft-js';
import { getBlockSel, createSel, createLineSel } from '../doc-util';
import { bq } from '../draft-to-doc';
import { showContent } from '../draft-util';

export const DOC_ADD_REF:string = "DOC_ADD_REF"

export const AddQuote = () => {

  return {type:DOC_ADD_REF, payload:{

  }}
}


/**
 * 
 * 
 * @param state 
 * @param ref 
 */
export const addQuote = (state:EditorState, doc:DocContent, page:PageState<any,any>) => {

  //let {ket1, key2, start, end} = toSel()
  var {ok, content,  type, txt, selection, lineSel, block,  key, start, end, isFirst, isLast } = getBlockSel(state)
  
  if (!ok) {
    return state  // <-- not going to handle the case where multiple blocks are selected
  }


if (doc.$$ == "Quote") {
  let {ref, lines} = doc 

  if (type == "Text"  && !isFirst) {
    // -- 1. Can just replace a text block if:
    //    - it's empty
    //    - it isn't the first block (title)
    var prevBlock:ContentBlock = content.getBlockBefore(key)
    
    //showContent(content)    


    // -- split twice
    var oldContent = txt

    content = Modifier.replaceText(content, lineSel!, "    ");
    var midSel = createSel(key, 1, key, 1)
    content = Modifier.splitBlock(content, midSel)
    //showContent(content)  
    var blockA = content.getBlockAfter(prevBlock.getKey())
    var blockB = content.getBlockAfter(blockA.getKey())
    var blockC = content.getBlockAfter(blockB.getKey())

    var keyB = blockB.getKey()
    var midSelB = createSel(keyB, 1,keyB, 1)
    content = Modifier.splitBlock(content, midSelB)
    blockA = content.getBlockAfter(prevBlock.getKey())
    blockB = content.getBlockAfter(blockA.getKey())
    blockC = content.getBlockAfter(blockB.getKey())

    //showContent(content)

    // -- now modify the middle block
    var midLineSel = createLineSel(blockB)
    content = Modifier.replaceText(content, midLineSel, lines.join("\n"));
    midLineSel = createLineSel(content.getBlockForKey(keyB))
    content = Modifier.setBlockType(content, midLineSel, bq);
    //showContent(content)
    // -- add annotation
    block = content.getBlockForKey(keyB)
    var annData = docToAnn(doc, page)
    content = addAnnotation(content,  block, doc.$$, annData)
    //showContent(content)
    block = content.getBlockForKey(keyB)
    //var data:DocContent = blockToContent(block, content)!

    // -- restore 

    var lineASel = createLineSel(blockA)
    content = Modifier.replaceText(content, lineASel, txt);

    
    //  -- and set selection of the final block  
    var keyC = blockC.getKey()
    var newSel = createSel(keyC, 0, keyC, 0)
    //showContent(content)
    state = updateContent(state, content);
    state = EditorState.acceptSelection(state, newSel);
    state = EditorState.forceSelection(state, state.getSelection());



    return state


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


