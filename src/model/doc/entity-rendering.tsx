import { CompositeDecorator, ContentState, EntityInstance, ContentBlock } from "draft-js";
import * as React from 'react'
import { handleStrategy, hashtagStrategy } from "./decorators";



export function createAnnotationDecorator():CompositeDecorator {

    const decorator = new CompositeDecorator([
    {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan,
    },
    {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan,
    },
    {
        strategy: getEntityStrategy('SEGMENTED'),
        component: TokenSpan,
    },
  ]);

  return decorator

}

// ---- c.f entity sample code -----

function getEntityStrategy(mutability:string) {

  return function(contentBlock:ContentBlock, callback:any, contentState:ContentState) {
      contentBlock.findEntityRanges(
      (character) => {
          const entityKey = character.getEntity();
          if (entityKey === null) {
              return false;
          }
          return contentState.getEntity(entityKey).getMutability() === mutability;
      },
      callback
      );
  };
}

function getDecoratedStyle(mutability:string) {
    switch (mutability) {
      case 'IMMUTABLE': return styles.immutable;
      case 'MUTABLE': return styles.mutable;
      case 'SEGMENTED': return styles.segmented;
      default: return null;
    }
}




function onMouseEnter(e:any)  {
  if (e.currentTarget) {
    var astID:string = e.currentTarget['data-entity-annotaion-id'] 
    
    
  }
}

function onMouseLeave(e:any) {
 


}


const TokenSpan = (props:any) => {
  var content:ContentState = props.contentState;

  var entity:EntityInstance = content.getEntity(props.entityKey)
  const style = getDecoratedStyle(
      entity.getMutability()
  ) as any;

  //var data = entity.getData()
  
//  var astUID = entity.getData().astRef


    
  return (
    <span 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}>
    {props.children}
    </span>
  );
};



  
const HandleSpan = (props:any) => {
  return (
    <span {...props} style={styles.handle}>
      {props.children}
    </span>
  );
}

const HashtagSpan = (props:any) => {
  return (
    <span {...props} style={styles.hashtag}>
      {props.children}
    </span>
  );
}

const styles:any = {
  root: {
    fontFamily: '\'Helvetica\', sans-serif',
    padding: 20,
    width: 600,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  immutable: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '2px 0',
  },
  mutable: {
    backgroundColor: 'rgba(204, 204, 255, 1.0)',
    padding: '2px 0',
  },
  segmented: {
    backgroundColor: 'rgba(248, 222, 126, 1.0)',
    padding: '2px 0',
  },
  handle: {
    color: 'rgba(98, 177, 254, 1.0)',
    direction: 'ltr',
    unicodeBidi: 'bidi-override',
  },
  hashtag: {
    color: 'rgba(95, 184, 138, 1.0)',
  }
    
}




export const hashDecorator = new CompositeDecorator([
  {
    strategy: handleStrategy,
    component: HandleSpan as any,
  },
  {
    strategy: hashtagStrategy,
    component: HashtagSpan as any,
  },
]);
