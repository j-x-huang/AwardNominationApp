import * as React from "react";
import "../App.css";

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <img
        style={{ width: "100%"}}
        src="http://hdqwalls.com/download/purple-sunset-in-ocean-2560x1440.jpg"
      />
    );
  }
}

export default Home;
