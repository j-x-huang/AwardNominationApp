import * as React from "react";
import "../App.css";
import * as firebase from "firebase";

class Admin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  public state = {
    isLockDown: false
  };
  public render() {
    return (
      <div id="adminDiv">
        <div className="adminOption">
          <div className="float-left">
          <span className="adminOptionTitle">Lockdown Site</span>
            <span>Prevent further award nominations</span>
          </div>
          <button
            type="button"
            className="btn btn-primary float-right"
            onClick={this.lockDown}
          >
            Initiate Lockdown
          </button>
        </div>
        <div className="adminOption">
          <div className="float-left">
          <span className="adminOptionTitle">Tally Nominations</span>
            <span>Export sorted nominations of each category</span>
          </div>
          <button
            type="button"
            className="btn btn-primary float-right"
            onClick={this.filterTally}
          >
            Export Results
          </button>
        </div>
      </div>
    );
  }
  private lockDown = () => {
    this.state.isLockDown = !this.state.isLockDown;
    console.log("Lock down " + this.state.isLockDown);
    this.setState({ isLockDown: this.state.isLockDown });
    this.writeLockState(this.state.isLockDown);
  };

  /*
  private readLockState = () => {
    const defaultDatabase = firebase.database();
    const lockPath = defaultDatabase.ref("/lockdown/lockstate");
    lockPath.once('value').then(value => {
        console.log(value.val());
        return value.val();
    })
  }
  */

  private writeLockState = (lockState: boolean) => {
    const defaultDatabase = firebase.database();
    const lockPath = defaultDatabase.ref("/lockdown");
    return lockPath.set({lockState});
  }
  private filterTally = () => {
    console.log("I will filter and tally");
  };
}

export default Admin;
