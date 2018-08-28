import * as React from "react";
import Octicon, { Flame } from "@githubprimer/octicons-react";

export interface INominationCompleteProps {
  category: string;
  nominee: string;
}

class NominationComplete extends React.Component<
  INominationCompleteProps,
  any
  > {
  public render() {
    const { category, nominee } = this.props;
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
            <p>
              There are no nominations available to view.
            </p>
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
            <a href="https://pa1.narvii.com/6175/9fcc08177a8c7886db798902b258152e0a219f1f_hq.gif">
              Click here to view your nomination.
            </a>
          </div>
        </div>
      );
    }
  }
}

export default NominationComplete;
