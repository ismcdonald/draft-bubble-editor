export default function assert(v, msg, o) {
  if (!v) {
    if (o) {
      console.log("assertion failure", {mayBeRelevant:o})
    }
    throw `Assertion Fail ${msg || ""}`
  }
}