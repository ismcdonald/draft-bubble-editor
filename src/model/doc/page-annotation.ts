import { NoteRef, Quote } from './Doc';
import { PageState } from '../resource/PageResource';


export const refToImg = (ref:NoteRef, size:string):string => {
  // /data/project/lea/essay/__img_s/Winnicott71.png
  var img = `/data/project/${ref.user}/${ref.project}/__img_s/${ref.ref}.png`
  return img
}


// -- TODO -  no need to couple the document to the page structure, this 
//            function should just ne injected
export const docToAnn = (doc:Quote, page:PageState<any,any>):any =>  {

  // -- action that will navigage toe 
  //  -- base ref is fro page 
  //  -- view is from view page 
  
  let {resource:r} = page

  //  REF: "/project/:user/:pname/:ref", 

  var {ref:nr} = doc
  var view = `/project/${nr.user}/${nr.project}/${nr.ref}`

  // TODO - abstact 
  var ref = {type:r.type.toUpperCase(), payload: r.params, query:{view, showView:true}}
  //var ref = {type:"TESTDOC", payload: { id:"quote2", query:{view:"/project/lea/essay/Kealy"}}}
  
  
  
  var img =  {
      s: refToImg(doc.ref, "s"),
      m: refToImg(doc.ref, "m")
  }


  var  refTxt = doc.ref.ref
  
  return {
    doc,
    img,
    ref,
    refTxt
  }


}
