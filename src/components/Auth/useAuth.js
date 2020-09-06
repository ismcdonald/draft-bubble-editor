import { useEffect, useState } from "react";
import firebase from "../../firebase";
function useAuth() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
      console.log(" --- auth state changed ---");
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => unsubscribe();
  }, [authUser]);

  return authUser;
}

export default useAuth;
