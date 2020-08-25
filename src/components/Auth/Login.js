import React from "react";
import useFormValidation from "./useFormValidation";
import validateLogin from "./validateLogin";
import firebase from "../../firebase";
import { Link } from "react-router-dom";

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
  const [login, setLogin] = React.useState(true);
  const [firebaseErr, setFirebaseErr] = React.useState(null);

  async function authenticateUser() {
    const { name, email, password } = values;
    try {
      const response = login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      console.log({ response });
      props.history.push("/");
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
      </div>
    </div>
  );
}

export default Login;
