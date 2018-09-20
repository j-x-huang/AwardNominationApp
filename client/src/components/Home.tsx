import * as React from "react";
import "../App.css";

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <div id="homeLabel">
          {" "}
          <div id="homeLabelText">Ignite Awards</div>{" "}
        </div>
        <img
          style={{
            width: "100vw",
            height: "calc(100vh - 80px)",
            objectFit: "cover"
          }}
          src="http://hdqwalls.com/download/purple-sunset-in-ocean-2560x1440.jpg"
        />
      </div>
    );
  }
}

export default Home;
