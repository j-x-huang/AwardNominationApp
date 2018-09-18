import * as React from "react";
import Octicon, { Flame } from "@githubprimer/octicons-react";

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
  }

  public render() {
    const { category, nominee, onClick } = this.props;

    if (nominee == null) {
      return (
        <div id="nominationComplete">
          <h2 className="complete-card-top">
            <Octicon size="medium" icon={Flame} />
            <Octicon size="medium" icon={Flame} />
            <Octicon size="medium" icon={Flame} />
            <Octicon size="medium" icon={Flame} />
            <Octicon size="medium" icon={Flame} />
          </h2>
          <div className="complete-card-bottom">
            <h3> Thanks for the ignite nomination </h3>
            <p>There are no nominations available to view.</p>
          </div>
        </div>
      );
    } else {
      return (
        <div id="nominationComplete">
          <h2 className="complete-card-top">
            <Octicon size="medium" icon={Flame} />
            <Octicon size="medium" icon={Flame} />
            <Octicon size="medium" icon={Flame} />
            <Octicon size="medium" icon={Flame} />
            <Octicon size="medium" icon={Flame} />
          </h2>
          <div className="complete-card-bottom">
            <h3> Thanks for the ignite nomination </h3>
            <p>
              Your nomination of <span>{nominee}</span> for{" "}
              <span>{category}</span> has been successfully recorded.
            </p>
            <a href="javascript:void(0);" onClick={onClick}>
              Click here to view your nomination.
            </a>
            <button type="button"
              className="btn btn-primary btn-purple"
              onClick={this.handleClick}>Nominate Again</button>
          </div>
        </div>

      );
    }
  }
}

export default NominationComplete;
