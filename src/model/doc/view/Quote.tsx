import * as React from 'react'
import { DocContent } from '../Doc'
import { blockToContent } from '../draft-to-doc'
import Link from 'redux-first-router-link'

var r = 0.7  // <-- makeing the images a bit smaller


export const Quote = (props:any) => {
  //console.log('=== rendering quote')

  if (!props.blockProps) {
    return (<>{props.children}</>)
  }

  const {block, contentState} = props;
  var txt = block.getText()

  // -- retrieve data entity
  var data:any = blockToContent(block, contentState)!
  if (!data) {
    //throw `BUG - no data anontated annoted on block: \n ${txt}`
    return (
    <blockquote style={{minHeight:100*r, paddingLeft:0, marginLeft:5}}>
      <h2> ******* ERROR ********  </h2>
      Known to occur after undow involving block
      "{txt}"
    </blockquote>)
  }
  
  var img = data.img.s

  if (data && data.doc.$$ == "Quote") {
    return (
    <blockquote style={{minHeight:100*r, paddingLeft:0, marginLeft:5}}>
      <div>
      <Link to={data.ref}>
        <img style={{width:75*r, height:100*r,  marginBottom:0,
            marginRight:15,
            float:"left", borderRadius:"5" }} 
            src={img}/>
      </Link>
       
        <div className="quote-text"> 
            {txt}
        </div>
        <div> 
        <div className="ref-link"
        
       contentEditable={false}>
            [<Link to={data.ref}>{data.refTxt}</Link>]
        </div>
        </div>
    
      </div> 
  

 

    </blockquote>)
  }
  // --

  return (<h1> Bad quote annotation</h1>)
    
 
}

