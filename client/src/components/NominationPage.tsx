import * as React from "react";
import NominationJustification from "./NominationJustification";

class NominationPage extends React.Component<any, any> {
  public state = {
    category: "Being Purple",
    nominee: "Boruto's Dad",
    justification: "He achieved his dream of becoming Hokage.",
    stage: 1
  };
  public render() {
    return (
      <div id="nominationPage">
        <NominationJustification
          category={this.state.category}
          nominee={this.state.nominee}
          justification={this.state.justification}
        />
      </div>
    );
  }
}

export default NominationPage;
