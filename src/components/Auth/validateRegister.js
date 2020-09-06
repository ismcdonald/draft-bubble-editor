

export const validateRegister = (state) => {
    let errors = [];
    let error;

    if (isFormEmpty(state)) {
      error = { message: "Fill in all fields" };
      return  errors.concat(error)
    
    } else if (!this.isPasswordValid(state)) {
      error = { message: "Password is invalid" };
      return errors.concat(error) 
    } 
    return null

  }

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

