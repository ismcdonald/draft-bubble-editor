import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  console.log("testing ... ");
  const { getByText } = render(<App />);
  const linkElement = getByText(/react/i);
  expect(linkElement).toBeInTheDocument();
});
