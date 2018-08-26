import * as React from "react";
import "../App.css";

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <img
        style={{ width: "100%", filter: "blur(0.5px)" }}
        src="https://pbs.twimg.com/media/DXX0Id4VMAEwa7a.jpg"
      />
    );
  }
}

export default Home;
