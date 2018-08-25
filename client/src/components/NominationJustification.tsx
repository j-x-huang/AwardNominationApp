import * as React from "react";

class NominationJustification extends React.Component<any, any> {
  public render() {
    return (
      <div id="nominationJustification">
        <div className="justificationInfo">
          <span>Category: </span>
          <span>Being Purple</span>
        </div>
        <div className="justificationInfo">
          <span>Employee: </span>
          <span>Uzumaki Naruto</span>
        </div>
        <div className="form-group">
          <label htmlFor="justificationBox">
            Please enter some justification for your nomination.
          </label>
          <textarea
            style={{ resize: "none" }}
            id="justificationBox"
            className="form-control"
            rows={6}
            defaultValue={""}
          />
        </div>
      </div>
    );
  }
}

export default NominationJustification;
