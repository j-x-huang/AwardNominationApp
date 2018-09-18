import * as React from "react";
import "../App.css";
import * as firebase from "firebase";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

class Admin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  public componentDidMount() {
    this.readLockState();
  }
  public state = {
    isLocked: false
  };
  public render() {
    return (
      <div id="adminDiv">
        <h4 id="adminTitle">Administrator Control Panel</h4>
        <div className="adminOptions">
          <div className="adminOption">
            <div className="float-left">
              <span className="adminOptionTitle">Tally Nominations</span>
              <span className="adminOptionDesc">
                Export sorted nominations of each category
              </span>
            </div>
            <button
              type="button"
              className="btn btn-success float-right adminButton"
              onClick={this.filterTally}
            >
              Export Results
            </button>
          </div>
        </div>
        <h4>Danger Zone</h4>

        <div className="adminOptions adminOptionsDanger">
          <div
            className={
              this.state.isLocked
                ? "adminOption adminOptionDisabled"
                : "adminOption"
            }
          >
            <div className="float-left">
              <span className="adminOptionTitle">Lockdown Site</span>
              <span className="adminOptionDesc">
                Prevent further award nominations
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger float-right adminButton"
              disabled={this.state.isLocked}
              onClick={this.showLockdownConfirmation}
            >
              Initiate Lockdown
            </button>
          </div>
          <hr className="adminHr" />
          <div
            className={
              !this.state.isLocked
                ? "adminOption adminOptionDisabled"
                : "adminOption"
            }
          >
            <div className="float-left">
              <span className="adminOptionTitle">Reenable Nominations</span>
              <span className="adminOptionDesc">
                Allow nominations to take place again
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger float-right adminButton"
              disabled={!this.state.isLocked}
              onClick={this.showLockdownConfirmation}
            >
              Abort Lockdown
            </button>
          </div>
          <hr className="adminHr" />

          <div className="adminOption">
            <div className="float-left">
              <span className="adminOptionTitle">Clean Restart</span>
              <span className="adminOptionDesc">
                Reset the state of award nominations
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger float-right adminButton"
              onClick={this.showLockdownConfirmation}
            >
              Reset Nominations
            </button>
          </div>
        </div>
      </div>
    );
  }

  private showLockdownConfirmation = () => {
    let msg = "Are you sure you want to lock down nominations";
    if (this.state.isLocked) {
      msg = "Are you sure you want to reenable nominations";
    }
    this.showConfirmationModal(msg, this.lockDown);
  };

  private showConfirmationModal = (dMsg: string, dYes: any) => {
    confirmAlert({
      title: "Confirm Action",
      message: dMsg,
      buttons: [
        {
          label: "Yes",
          onClick: () => dYes()
        },
        {
          label: "No"
        }
      ]
    });
  };

  private lockDown = () => {
    this.state.isLocked = !this.state.isLocked;
    console.log("Lock down " + this.state.isLocked);
    this.setState({ isLockDown: this.state.isLocked });
    this.writeLockState(this.state.isLocked);
    location.reload();
  };

  private readLockState = () => {
    const defaultDatabase = firebase.database();
    const lockPath = defaultDatabase.ref("/lockdown");
    lockPath.once("value").then(value => {
      console.log(value.val().lockState);
      this.setState({ isLocked: value.val().lockState });
      return value.val().lockState;
    });
  };

  private writeLockState = (lockState: boolean) => {
    const defaultDatabase = firebase.database();
    const lockPath = defaultDatabase.ref("/lockdown");
    return lockPath.set({ lockState });
  };
  private filterTally = () => {
    console.log("I will filter and tally");
  };
}

export default Admin;
