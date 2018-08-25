import * as React from "react";

class NominationComplete extends React.Component<any, any> {
  public render() {
    return (
      <div id="nominationComplete">
        <img
          src="https://pa1.narvii.com/6175/9fcc08177a8c7886db798902b258152e0a219f1f_hq.gif"
          alt="Thank You"
          id="nominationCompleteImage"
        />
        <div>Nomination Complete</div>
        <div>
          You have nominated <span>Boruto's Dad</span> for{" "}
          <span>Feeling Purple</span>.
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
