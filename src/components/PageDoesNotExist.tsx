import * as React from "react";
import "../css/App.css";

class PageDoesNotExist extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <div id="homeLabel">
          {" "}
          <div id="homeLabelText">Page Does Not Exist</div>{" "}
        </div>
        <img
          style={{
            width: "100%",
            height: "calc(100vh - 80px)",
            objectFit: "cover",
          }}
          src="https://orig00.deviantart.net/e641/f/2018/043/e/7/pretty_by_edgelordxxaqua-dc2zbp6.jpg"
        />
      </div>
    );
  }
}

export default PageDoesNotExist;
