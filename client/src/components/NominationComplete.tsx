import * as React from "react";

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

    return (
      <div id="nominationComplete">
        <img
          src="https://pa1.narvii.com/6175/9fcc08177a8c7886db798902b258152e0a219f1f_hq.gif"
          alt="Thank You"
          id="nominationCompleteImage"
        />
        <div>Nomination Complete</div>
        <div>
          You have nominated <span>{nominee}</span> for <span>{category}</span>.
        </div>
        <div>
          <a href="https://pa1.narvii.com/6175/9fcc08177a8c7886db798902b258152e0a219f1f_hq.gif">
            Click here to view your nomination.
          </a>
        </div>
      </div>
    );
  }
}

export default NominationComplete;
