import { addAnnotation } from './quote-model';
import { Doc, Text, Quote, NoteRef, DocContent } from "./Doc"
import { RawDraftContentBlock, DraftBlockType, EditorState, RawDraftContentState, convertFromRaw, ContentBlock, RawDraftInlineStyleRange, RawDraftEntityRange, ContentState, Modifier } from "draft-js"
import { createAnnotationDecorator } from "./entity-rendering"
import {hashDecorator} from "./entity-rendering"
import { keys } from 'object-hash';
import { updateContent } from './doc-actions';

var count = 1 // <-- used for unique keys

const h1 = "header-two"
const p = "paragraph"
const bq = "blockquote"

var entities = []


export const docToDraft = (doc:Doc) =>  {
  var blocks:Array<RawDraftContentBlock> = []
  var src:Array<DocContent> = []

  for (var item of doc.vs) {
    switch (item.$$) {
      case "Text":

        for (var line of item.lines) { 
          var type = p  
          var header = parseHeader(line) 
          if (header) {
            line = header   // "# This is a header"
            type = h1 
          } else {
            type = p
          } 
          blocks.push(lineToRawContentBlock(line, type))
          src.push(item)
        } 
        break
      case "Quote":
        for (var line of item.lines) {
          blocks.push(lineToRawContentBlock(line, bq, item))
          src.push(item)
        }
        break
    }

  }
  return toEditorState(blocks, src)
}

const HEADER:RegExp = /^#+(.*)*$/

/**
 * returns a string if the text has a header token (ie "# this is a header")  null otherwise 
 * 
 */
export const parseHeader = (v:string) => {
  var matchArr = HEADER.exec(v);
  if (matchArr) {
    return matchArr[1];
  }
  return null
}


function toEditorState<D,S>(blocks:Array<RawDraftContentBlock>, src:Array<DocContent>):EditorState {
    var rawContent:RawDraftContentState  = {
        //  blocks: Array<RawDraftContentBlock>;
        //  entityMap: { [key: string]: RawDraftEntity };
          blocks: blocks,
          entityMap: {}
  
      } // as RawDraftContentState

    const decorator = hashDecorator;

    var state = EditorState.createWithContent(convertFromRaw(rawContent), hashDecorator)

    // -- iterate over blocks
    var content:ContentState = state.getCurrentContent()
    var block:ContentBlock = content.getFirstBlock()

    var n = 0
    while (block) {
      var key = block.getKey()
      var txt = block.getText()
      console.log(`${n}: ${txt}`)
      // -- 
      var doc = src[n]
      var nextKey = content.getKeyAfter(key)
      // ---  TODO abstract iteration around this 
      if (doc.$$ == "Quote") {
        block = content.getBlockForKey(key)
        content = addAnnotation(content, block, doc)
      }
      /// 
      n++ 
      block = content.getBlockForKey(nextKey)

    }

    return updateContent(state, content)

} //  toEditorState





export const draftToDoc = (state:EditorState):Doc => {
  let content = state.getCurrentContent()

  var items:Array<ContentBlock> = content.getBlocksAsArray()
  var grouped = groupByType(items)
  var vs = grouped.map(items => toContent(items, content));
  return Doc(vs)

}


const groupByType = (blocks:ContentBlock[]) => {
  var i = 0
  var out = []
  while (i < blocks.length)  {
    let block0 = blocks[i];
    let type = toContentType(block0);
    let group = shouldGroup(type)
    var items = [block0]
    i++;
    if (group) {
      while (i < blocks.length) {
        let block1:ContentBlock = blocks[i]
        if (toContentType(block1) == type) {
          items.push(block1);
          i++
        } else {
          break
        }
      }
    }
    out.push({type, items})
  }
  return out
} 


export const blockToContent = (block:ContentBlock, content:ContentState) => {
  var key = block.getEntityAt(0)
  if (key) {
    const entity = content.getEntity(key)
    var data:DocContent = entity.getData() 
    return data
  }
  return null
}


const toContent = ({type, items}:{type:string, items:ContentBlock[]}, content:ContentState):any => {
  switch (type) {
    case "Text":
      return Text(items.map(blockToText))
    case "Quote":
      var quoteBlock = items[0]
      var quote = blockToContent(quoteBlock, content )
      return quote

  }
}

const blockToText = (block:ContentBlock):string =>  {
  var type = block.getType()
  var txt = block.getText()
  return `${(type == h1) ? "# " : ""}${txt}`
}

export const isHeader = (type:string):boolean => (type == "header-two")




/**
 * Encodes mapping a draft representation back to the semanitcs of the serialized data model.
 *  
 * 
 * @param block 
 * 
 */
export const toContentType = (block:ContentBlock):string => {
  var type = block.getType();

  if (type == "blockquote") {
    return "Quote"
  } else {
      // includes headers & paragraph  
    return "Text"   //  <-- this includes headers, use isHeader to distinguish
  }

}



const shouldGroup = (type:string):boolean =>  {
  return type == "Text" 
}






function lineToRawContentBlock(srcTxt:string, regionType:string, doc?:DocContent):RawDraftContentBlock {
  var data:{[key:string]:any} 

  var key = (count++) 
  if (doc) {
    // -- add annotation 
    data = {};
    data[key.toString()] = doc
  }

  return  {
      key:key.toString(),  // <-- Q: what's the nature of the key?
      type: regionType  as DraftBlockType,  // HACK. docs are inconsistent, probably version issue     "unstyled",         //"unstyled", //DraftBlockType
      text: srcTxt,
      depth: 0,
      inlineStyleRanges:  [] as RawDraftInlineStyleRange[],
      entityRanges: [{key, offset:0, length: srcTxt.length }]  as  RawDraftEntityRange[],
      data:data!
    
  }  //as  RawDraftContentBlock
}