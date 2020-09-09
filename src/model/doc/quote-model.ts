import { DocContent } from "./Doc";
import { ContentBlock, ContentState, Modifier } from "draft-js";
import { createLineSel } from "./doc-util";


export const addAnnotation = (content:ContentState, block:ContentBlock, type:string, data:any):ContentState => {

  const newContent = content.createEntity(data.$$, 'MUTABLE', data);
  const key = newContent.getLastCreatedEntityKey();

  const contentWithEntity:ContentState = Modifier.applyEntity(
    newContent,
    createLineSel(block),
    key,
  );

  var block1 = contentWithEntity.getBlockForKey(block.getKey())

  var key1 = block1.getEntityAt(0)
  if (key1 == null) {
    console.log(" NO ENTITuy!!!")
  }
    
  return contentWithEntity
}