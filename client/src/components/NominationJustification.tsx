import * as React from "react";

export interface INominationJustificationProps {
  category: string;
  nominee: string;
  justification: string;
}

class NominationJustification extends React.Component<
  INominationJustificationProps,
  any
  > {
  public render() {
    const { category, nominee, justification } = this.props;

    return (
      <div id="nominationJustification">
        <div className="justificationInfo">
          <span>Category: </span>
          <span>{category}</span>
        </div>
        <div className="justificationInfo">
          <span>Employee: </span>
          <span>{nominee}</span>
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
            defaultValue={justification}
          />
        </div>
      </div>
    );
  }
}

export default NominationJustification;
