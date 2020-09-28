import React from "react";
import useFormValidation from "./useFormValidation";
import firebase, { FirebaseContext } from "../../firebase";
import Link from "redux-first-router-link";
import { useDispatch } from "react-redux";

import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import { validateRegister } from "./validateRegister";

const handleChange2 = () => {
  console.log('change2')
}


const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
};

function Register(props) {
  const {  handleChange, handleSubmit, handleBlur,
            values,  errors, isSubmitting
        } = useFormValidation(INITIAL_STATE, validateRegister, authenticateUser);
  
  const dispatch = useDispatch();
  const [login, setLogin] = React.useState(true);
  
  
  const [firebaseErr, setFirebaseErr] = React.useState(null);




  async function authenticateUser() {


    const { name, email, password } = values;
    try {
      const response = login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      console.log({ response });
     // dispatch({ type: "HOME" });   // <--  causes crash 
      console.log("==received login");
    } catch (err) {
      console.log(err);
      setFirebaseErr(err.message);
    }
  }


  
  return (
    <div>
      <h2 className="mv3">{login ? "Login" : "Create Account"}</h2>
      <form className="flex flex-column" onSubmit={handleSubmit}>
        {!login && (
          <input
            type="text"
            placeholder="your name"
            autoComplete="off"
            name="name"
            onChange={handleChange}
            value={values.name}
          />
        )}
        <input
          type="email"
          placeholder="email"
          className={errors.email && "error-input"}
          onBlur={handleBlur}
          autoComplete="off"
          name="email"
          onChange={handleChange}
          value={values.email}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          type="password"
          placeholder="password"
          onBlur={handleBlur}
          name="password"
          className={errors.email && "error-input"}
          onChange={handleChange}
          value={values.password}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseErr && (
          <p className="error-text">{"server error: " + firebaseErr} </p>
        )}
        <div className="flex mt3">
          <button
            type="submit"
            className="button pointer mr2"
            disabled={isSubmitting}
            style={{ background: isSubmitting ? "grey" : "teal" }}
          >
            Submit
          </button>
          <button
            type="button"
            className="pointer button"
            onClick={() => setLogin((prevLogin) => !prevLogin)}
          >
            {login ? "need to create an account?" : "already have an account?"}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot">Forgot Password</Link>
        
      </div>


      <Grid textAlign="center" verticalAlign="middle" className="appx">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="teal" textAlign="center">
            <Icon name="coffee" color="teal" />
            Register for Kim and Lea Book on cafetextual 
          </Header>
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"  
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                className={handleInputError(errors, "username")}

                type="text"
              />

              <Form.Input
                fluid
                name="email"
                className={handleInputError(errors, "email")}

                value={values.email}
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                className={handleInputError(errors, "password")}
                value={values.password}
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                className={handleInputError(errors, "Password Confirmation")}
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
              />
              {(errors || firebaseErr) && 
                (<Message error>
                  <h3>Error</h3>
                  {errors  && displayErrors(errors)}
                  {firebaseErr && displayErrors([{message:firebaseErr}])}
                </Message>)}
              <Button color="teal" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login</Link>
            {" "}<Link to="/">home</Link>
            {" "}<Link to={"project/lea/essay"}>essay</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </div>

    
  );
}


const displayErrors = errors => {
  return errors.map((err, i) => (<p key={i}>{err.message}</p>))
}
const handleInputError = (errors, inputName) => {
  return errors.some(error => error.message.toLowerCase().includes(inputName))
    ? "error"
    : "";
};

export default Register;
