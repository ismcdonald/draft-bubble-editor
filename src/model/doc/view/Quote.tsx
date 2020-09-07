import * as React from 'react'
import EditorBlockMap from './EditorBlockMap'
import {EditorBlock}  from 'draft-js'
import { DocContent } from '../Doc'
import { blockToContent } from '../draft-to-doc'


export const Quote = (props:any) => {
  console.log('got quotes')

  if (!props.blockProps) {
    return (<>{props.children}</>)
  }

  const {block, contentState} = props;
  var txt = block.getText()

  // -- retrieve data entity
  var data:DocContent = blockToContent(block, contentState)!

  
  if (data && data.$$ == "Quote") {
    return (
    <blockquote>
      <div style={{float:"right"}} contentEditable={false}>
          [<a href="something">{data.ref.ref} </a>]
          {" "}
          {(data.ref.pg! > 0) ? 
            <a href="somtehingelse">pg{data.ref.pg}</a>
            : ""}
      </div>
      {txt}

 

    </blockquote>)
  }
  // --

  return (<h1> Bad quote annotation</h1>)
    
 
}

