import * as React from "react";
import "../App.css";

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <img
        style={{
          width: "100%",
          filter: "blur(1px)"
        }}
        src="https://i.pximg.net/img-master/img/2018/03/06/21/29/43/67606282_p0_master1200.jpg"
      />
    );
  }
}

export default Home;
