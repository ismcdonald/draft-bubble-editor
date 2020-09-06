import * as React from "react";
import validateCreateLink from "../Auth/validateCreateLink";
import useFormValidation from "../Auth/useFormValidation";
import { FirebaseContext } from "../../firebase";
import { useDispatch } from "react-redux";
import { NavToLogin, NavToHome } from "../../model/pageReducer";

const INITIAL_STATE = {
  description: "",
  content: "",
};

function CreateLink() {
  console.log(" -- rendering create ---")
  const { firebase, user } = React.useContext(FirebaseContext);
 
  const dispatch = useDispatch()

  const { handleChange, handleSubmit, values, errors } = useFormValidation(
    INITIAL_STATE,
    validateCreateLink,
    handleCreateLink
  );

  function handleCreateLink(values) {
    if (!user) {
      dispatch(NavToLogin)  // <-- UI should ensure this never happens 
    } else {
      let { description, content } = values;

      const newContent = {
        description,
        content,
        postedBy: {
          id: user.uid,
          name: user.displayName,
        },
        votes: [],
        comments: [],
        created: Date.now(),
      };

      firebase.db.collection("content0").add(newContent);
      
      dispatch(NavToHome());

    }
  }
  return (
    <form className="flex flex-column mt3" onSubmit={handleSubmit}>
      <input
        name="description"
        placeholder="Description for link"
        autoComplete="off"
        type="text"
        value={values.description}
        onChange={handleChange}
        className={errors.description && "error-input"}
      />
      {errors.description && (
        <p className="error-text">{errors.description} </p>
      )}
      <input
        name="content"
        placeholder="content"
        autoComplete="off"
        type="text"
        value={values.content}
        onChange={handleChange}
        className={errors.content && "error-input"}
      />
      {errors.content && <p className="error-text">{errors.content} </p>}

      <button className="button" type="submit">
        publish
      </button>
    </form>
  );
}

export default CreateLink;
