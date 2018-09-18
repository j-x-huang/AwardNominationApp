import * as React from "react";

// import { Route } from "react-router-dom";

export interface INominationCompleteProps {
  category: string;
  nominee: string;
  onClick: (...args: any[]) => void;
}

class NominationComplete extends React.Component<
  INominationCompleteProps,
  any
> {
  private handleClick = () => {
    location.reload();
  };

  public render() {
    const { category, nominee, onClick } = this.props;
    return (
      <div id="nominationComplete">
        <h2 className="complete-card-top">
          <i className="material-icons">insert_emoticon</i>
        </h2>
        <div className="complete-card-bottom">
          <h3> Thanks for the Nomination </h3>
          <p>
            <span>{nominee}</span> for <span>{category}</span>
          </p>
          <button
            type="button"
            className="btn btn-outline-secondary float-left"
            onClick={onClick}
          >
            View Nomination
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary float-right"
            onClick={this.handleClick}
          >
            Nominate Again
          </button>
        </div>
      </div>
    );
  }
}

export default NominationComplete;
