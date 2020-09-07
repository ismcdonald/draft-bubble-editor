

//import { DraftBlockRenderConfig } from 'draft-js'
//import { CoreDraftBlockType } from './DraftBlockType';
//
import { Map } from 'immutable';
import * as React from 'react';
import { ContentBlock } from 'draft-js';
import {Quote} from "./Quote"

//const cx  = require( 'fbjs/lib/cx');

//import '../../../../fonts/fonts.css'
//import './code-editor.css'

//type DefaultCoreDraftBlockRenderMap = Map<CoreDraftBlockType, DraftBlockRenderConfig>;

//const UL_WRAP = <ul className={cx('public/DraftStyleDefault/ul')} />;
//const OL_WRAP = <ol className={cx('public/DraftStyleDefault/ol')} />;
//const PRE_WRAP = <pre className={cx('public/DraftStyleDefault/pre')} />;

const REGION_1 = <div className='CodeEditor-region-1'/>;
const REGION_2 = <div className='CodeEditor-region-2'/>;
const REGION_3 =  <div className='CodeEditor-region-3'/>;
              
function regionDiv(name:string):any {
  
  var wrapper:JSX.Element =  <div className ={"CodeEditor-"+name}/> 
  
  return {
     element:'div' ,
     wrapper: wrapper
  }
}





const EditorBlockMap:Map<string,any>  = Map({ 
  'header-one': {
    element: 'h1'
  },
  'header-two': {
    element: 'h2'
  },
  'header-three': {

    element: 'h3'
  },
  'header-four': {
    element: 'h4'
  },
  'header-five': {
    element: 'h5'
  },
  'header-six': {
    element: 'h6'
  },
 // 'unordered-list-item': {
 //  element: 'li',
 //   wrapper: UL_WRAP
 // },
 // 'ordered-list-item': {
 //   element: 'li',
 //   wrapper: OL_WRAP
 // },
  blockquote: {
    element: 'blockquote',
    wrapper: <Quote/>
  },
  atomic: {
    element: 'figure'
  },
  //'code-block': {
  //  element: 'pre',
  //  wrapper: PRE_WRAP
  //},
  unstyled: {
    element: 'div',
    aliasedElements: ['p']
  },
/*
  'region-1': {
      wrapper: REGION_1,
      element: 'div' 
  },
  'region-2': {
      wrapper: REGION_2,
      element: 'div'
  }, 'region-3': {
    element: 'div',
    wrapper: REGION_3,
  },

  // automateable
  'region-testsuite-header': regionDiv('region-testsuite-header'),
  'region-grammar-header': regionDiv('region-grammar-header'),
  'region-grammar': regionDiv('region-grammar'),
  'region-source-header': regionDiv('region-source-header'),
  'region-source': regionDiv('region-source'),
  'invalid-region': regionDiv('invalid-region')

*/

});





export function myBlockRenderer(contentBlock:ContentBlock) {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return {
      component: Quote,
      editable: false,
      props: {
        foo: 'bar  goes here',
      },
    };
  }
}



export default EditorBlockMap