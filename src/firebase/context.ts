import { createContext } from "react";

interface FirebaseContext {
  user: any;
  firebase: any;
}
const FirebaseContext = createContext<FirebaseContext | null>(null);

export default FirebaseContext;
