import { ContentState, ContentBlock } from 'draft-js';

const HEADER_REGEX = /^\#+\s+.*/ 
const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;


export function headerStrategy(contentBlock:ContentBlock, callback:any, contentState:ContentState) {
  findWithRegex(HEADER_REGEX, contentBlock, callback) ;
}

 function findWithRegex(regex:RegExp, contentBlock:ContentBlock, callback:any) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}



export function handleStrategy(contentBlock:ContentBlock, callback:any, contentState:ContentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

export function hashtagStrategy(contentBlock:ContentBlock, callback:any, contentState:ContentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}
