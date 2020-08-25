export default function validateCreateLink(values) {


  //const URL_REGEXP = /^(ftp|http|https):\/\/[^ "]+$/i


  if (values) {
    let errors = {}
  
    // -- desc 
      if (!values.description) {
        errors.description = "Description required"
      } 

      if (!values.content) {
        errors.content = "Content Required"
      } 
      

      
  
  
    // -- password
  
    return errors
  }
  


}
