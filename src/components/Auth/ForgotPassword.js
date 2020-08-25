import React from "react";
import { FirebaseContext } from "../../firebase";

function ForgotPassword() {
  const { firebase } = React.useContext(FirebaseContext);
  const [resetPasswordEmail, setResetPasswordEmail] = React.useState("");
  const [isPasswordReset, setIsPasswordReset] = React.useState(false);
  const [passwordResetErr, setPasswordResetErr] = React.useState(null);

  async function handleResetPassword() {
    try {
      await firebase.resetPassword(resetPasswordEmail);
      setIsPasswordReset(true);
      setPasswordResetErr(null);
    } catch (err) {
      console.error("error sendng email", { err });
      setIsPasswordReset(false);
      setPasswordResetErr(err.message);
    }
  }

  return (
    <div>
      <input
        type="email"
        className="input"
        placeholder="You account email"
        onChange={(event) => setResetPasswordEmail(event.target.value)}
      />
      <div>
        <button className="button" onClick={handleResetPassword}>
          Reset password
        </button>

        {isPasswordReset && <p>Check email to reset password</p>}
        {passwordResetErr && <p className="error-text">{passwordResetErr}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
