import React from "react";
import useFormValidation from "./useFormValidation";
import validateLogin from "./validateLogin";
import firebase, { FirebaseContext } from "../../firebase";
import Link from "redux-first-router-link";
import { useDispatch } from "react-redux";
import useAuth from "./useAuth";

import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'

const handleChange2 = () => {
  console.log('change2')
}


const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
};

function Login(props) {
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    isSubmitting,
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);
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
      //dispatch({ type: "HOME" });
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
            style={{ background: isSubmitting ? "grey" : "orange" }}
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
        <Link to="/">home</Link>
        <Link to={"project/lea/essay"}>essay</Link>
      </div>


      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={handleChange2}
                type="text"
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={handleChange2}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={handleChange2}
                type="password"
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={handleChange2}
                type="password"
              />

              <Button color="orange" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </div>

    
  );
}

export default Login;
