import { toContentType, isHeader } from './draft-to-doc';
import {EditorState, ContentState, ContentBlock, SelectionState} from 'draft-js';

/**
 * Utility to destructure selection
 */
export const toSel = (state:EditorState):{start:number, end:number, key1:any, key2:any} => {
  var sel:SelectionState = state.getSelection();
  var key1 = sel.getStartKey()
  var key2 = sel.getEndKey();

  return {
    start: sel.getStartOffset(),
    end: sel.getEndOffset(),
    key1,
    key2
  }
}



/**
 *   
 *  When the current  a selection object for the text of an entire block 
 *  
 * @param state 
 *  
 * returns:
 *   ok  - returns true when the selection is within a single block. All other values null otherwise
 *   selection - current selection
 *   block - current block 
 * 
 *   --- these return null unless we have a selection in a single block
 *  
 *   lineSel - selection of the entire line (constructed, but not applied to state)
 *   txt - block text
 *   block - current block
 *   type - the semantic type (ie. Text, Quote)
 * 
 */
export const getBlockSel = (state:EditorState):{
        ok:boolean, content:ContentState, selection:SelectionState,
        lineSel?:SelectionState, txt:string,
        block:ContentBlock, key:string, type:string, header?:boolean, start?:Number, end?:Number,
        isFirst:boolean, isLast:boolean
      } => {

  var content = state.getCurrentContent();
  var selection = state.getSelection();
  var key = selection.getStartKey()
  
  var block = content.getBlockForKey(key);
  var type = toContentType(block)  
  var txt = block.getText();

  var isFirst = (key == content.getFirstBlock().getKey())
  var isLast = (key == content.getLastBlock().getKey())
  
  const header = (type == "Text" && isHeader(block.getType())) ? true : undefined
  var base = {content, selection, isFirst, key, block, isLast, type, txt};

  
  
  if (key !== selection.getEndKey()) {   // <-- quit if selection spans multiple blocks
    return {ok:false, ...base}
  }

  var start = selection.getStartOffset();
  var end = selection.getEndOffset();


  const lineSel = selectBlock(state)

  return {ok:true,  lineSel, header, start, end , ...base }

} 


const selectBlock = (state:EditorState):SelectionState => {
  var selection = state.getSelection();
  var content = state.getCurrentContent()
  var key = selection.getAnchorKey();
  var block = content.getBlockForKey(key);


  var sel = createSel(key, 0, key,block.getText().length)
  
  return sel
}


const EMPTY_SEL:SelectionState = SelectionState.createEmpty('foo')


export function createLineSel(block:ContentBlock  ):SelectionState {
  var key:string = block.getKey()
  var txt = block.getText()
  return createSel(key, 0, key, txt.length  )
}


export function createSel(line0Key:string, line0Index:number, line1Key:string, line1Index:number) :SelectionState{
  return  EMPTY_SEL.merge({
       anchorKey: line0Key,
       anchorOffset:  line0Index,
       focusKey:  line1Key,
       focusOffset: line1Index,
       hasFocus: true
   }) as SelectionState
}