import { Modifier, SelectionState, ContentState, EditorState, ContentBlock } from 'draft-js/';
import { h1, h2, p} from './draft-to-doc'
import { toSel, getBlockSel } from './doc-util';

// -- encoding document semantics in low level transformations of draft-js data model
// 




/**
 * 
 *  Set text or header on a block, iff:
 *   - cursor is at the beginning of a line of a block
 *   - block was already text or header
 * 
 */
export const setHeader = (state:EditorState, toHeader:boolean):ContentState =>  {

  let {ok, type, block, selection, content, header, lineSel, start, end} = getBlockSel(state)

  if (ok && type == "Text" && start == 0 && end == 0) {

    var isFirst = (content.getFirstBlock() == block);

    var newBlockType =  isFirst ? h1 : (  toHeader  ? h2 : p)

    if (newBlockType  != block!.getType()) {
      var newContent = Modifier.setBlockType(state.getCurrentContent(), lineSel!, newBlockType)
      return newContent 
    }
  }

  return content
}

export const updateContent = (state:EditorState, content:ContentState):EditorState => {
  if (state.getCurrentContent() != content) {
    return EditorState.push(state, content, 'change-block-data')
  }
  return state
}

export const removeSel = (state:EditorState) => {
  let {start, end, key1, key2} = toSel(state)
  
  if ((key1 !== key2)  || (start !== end)) {
    const selection = SelectionState.createEmpty(key1).merge({  
      anchorKey:key1,
      focusKey: key2,
      anchorOffset: start,  
      focusOffset: start,
    })


    return EditorState.set(state, {selection})
  }
  return state
  
}