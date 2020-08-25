export default function validateLogin(values) {
  let errors = {}

  // -- email 
    if (!values.email) {
      errors.email = "Email required"
    } else if (!EMAIL.test(values.email)) {
      errors.email = "Invalid email address"
    } 
    if (!values.password) {
      errors.password = "Password Required"
    } else if (values.password.length < 1) {
      errors.password = "Password must be at least 1 character"
    }


  // -- password

  return errors
}

const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i