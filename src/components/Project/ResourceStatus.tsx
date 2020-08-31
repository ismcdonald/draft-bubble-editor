import * as React from "react";
import { PageState } from "../../model/resource/PageResource";

const ResourceStatus: React.FunctionComponent<{ page: PageState<any, any> }> = ({
  page,
}) => {

  let rurl = page.resource.rurl
  let { isLoading, isReady, errorMsg } = page.status;
  
  return (
    <div>
      <h1>Project</h1>
      <p> url: {rurl}</p>
      <h2 style={{textAlign:"center"}}>{isLoading ? "Loading" : (errorMsg ? "Error" : "")} </h2>
      <h2 style={{textAlign:"center"}}>{isReady ? " Ready ... ": "..." }   </h2>
      {errorMsg ?
        <div>
          <p>loadError: {errorMsg ? errorMsg.join("\n") : ""}</p>
          <p>url: {page.status.fullURL}</p>
        </div>
      :
        ""}
    </div>
  );
};

export default ResourceStatus;
