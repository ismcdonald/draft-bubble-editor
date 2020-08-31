import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

const hash = require('object-hash');

test("renders learn react link", () => {
  console.log("testing ... ");
  const { getByText } = render(<App />);
  const linkElement = getByText(/react/i);
  expect(linkElement).toBeInTheDocument();
});


test("parses filenames annotated /w note author", () => {

  parseNotesAuth("aa.bb")
    expect(o).toEqual({auths:"aa", notesAuth:"bb"})

    expect(parseNotesAuth("ab . c")).toEqual({auths:"ab . c"})

    expect(parseNotesAuth("a .@doc")).toEqual({auths:"a ", notesAuth:"@doc"})

    expect(parseNotesAuth("asdf.x2.as")).toEqual({auths:"asdf.x2", notesAuth:"as"})

})


function parseNotesAuth(v) {
  var toAuth = RegExp(/^(.*)\.([a-zAz09\-\_\@]+)$/)
  var match = toAuth.exec(v)
  if (!match) {
    return {auths:v}
  }
  var auths = match[1]
  var notesAuth = match[2]
  return {auths, notesAuth}

}


test("basic obejct hashing", () => {


  var o = hash({foo: 'bar'}) // => '67b69634f9880a282c14a0f0cb7ba20cf5d677e9'
  console.log(o)                     f9ea3c42a40c27fcfa9805ff5c30c3e9

  o = hash({foo: 'bar'}, {algorithm:'md5'}) // => '67b69634f9880a282c14a0f0cb7ba20cf5d677e9'
  console.log(o)
  

})