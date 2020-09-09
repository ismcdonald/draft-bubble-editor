export default function assert(v, msg, o) {
  if (!v) {
    if (o) {
      console.log("assertion failure: \n  "  + msg, {msg,mayBeRelevant:o})
    }
    throw `Assertion Fail ${msg || ""}`
  }
}