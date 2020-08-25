import * as React from "react";
import { PageState } from "../../model/model";

const ResourceStatus: React.FunctionComponent<{ page: PageState<any> }> = ({
  page,
}) => {
  let { url, isLoading, isReady, errorMsg } = page;
  return (
    <div>
      <h1>Project</h1>
      <p> url: {url}</p>
      <p>isLoading: {isLoading ? "yes" : "no"} :</p>
      <p>isREad: {isReady}</p>
      <p>loadError: {errorMsg ? errorMsg.join("\n") : ""}</p>
    </div>
  );
};

export default ResourceStatus;
