import { actionToURI } from './../pageReducer';
import { NoteRef, Quote } from './Doc';
import { PageState } from '../resource/PageResource';
import { SECTION } from '../../components/Project/Notes/filter';


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
  
  //  REF: "/project/:user/:pname/:ref",  <--- FIX_THIS - this
  
  var {ref:nr, sec} = doc
  var {user, project, did} = nr


  var select = did
  var sel = sec
  var col = null
  if (sec) {
    col = [SECTION]
  }
  var viewAction:any = 
  {type:"REF", 
    payload:{  //   `/project/${nr.user}/${nr.project}/${nr.ref}`
      user,
      pname:project,
      ref:nr.ref
    }, 
    query: {
      sel,
      col,
      select
    }

  }

  
  var view = actionToURI(viewAction)
  var showView = true
 

  var ref = {type:r.type.toUpperCase(), payload: r.params, query:{view, showView}}
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
