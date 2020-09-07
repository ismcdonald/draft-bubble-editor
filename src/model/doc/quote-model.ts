import { DocContent } from "./Doc";
import { ContentBlock, ContentState, Modifier } from "draft-js";
import { createLineSel } from "./doc-actions";


export const addAnnotation = (content:ContentState, block:ContentBlock, data:DocContent) => {

  const newContent = content.createEntity(data.$$, 'MUTABLE', data);
  const key = newContent.getLastCreatedEntityKey();

  const contentWithEntity:ContentState = Modifier.applyEntity(
    newContent,
    createLineSel(block),
    key,
  );

  return contentWithEntity
}