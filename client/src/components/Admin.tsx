import * as React from "react";
import "../App.css";
import * as firebase from "firebase";
import { confirmAlert } from "react-confirm-alert";
import AdminOption from "./AdminOption";
// import * as XLSX from 'xlsx';
import { saveAs } from "file-saver/FileSaver";

class Admin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  public componentDidMount() {
    this.readLockState();
  }
  public state = {
    isLocked: false,
    lockPath: firebase.database().ref("/lockdown"),
    finalTally : ["Category,Name,Tally\n"] as any
  };

  public csvLine(category : string, name : string, tally : number) {

    const data = category + "," + name + "," + tally + "\n";

    this.state.finalTally.push(data);

  }

  public render() {
    return (
      <div id="adminDiv">
        <h4 id="adminTitle">Administrator Control Panel</h4>
        <div className="adminOptions">
          <AdminOption
            title="Tally Nominations"
            desc="Export top nominations of each category"
            buttonDesc="Export Results"
            onBtnClick={this.filterTally}
            disabled={false}
            dangerous={false}
          />
          <hr className="adminHr" />
          <AdminOption
            title="Export Database Locally"
            desc="Save Firebase JSON table"
            buttonDesc="Export Database"
            onBtnClick={this.exportDatabase}
            disabled={false}
            dangerous={false}
          />
        </div>
        <h4>Danger Zone</h4>

        <div className="adminOptions adminOptionsDanger">
          <AdminOption
            title="Lockdown Site"
            desc="Prevent further award nominations"
            buttonDesc="Initiate Lockdown"
            onBtnClick={this.showLockdownConfirmation}
            disabled={this.state.isLocked}
            dangerous={true}
          />
          <hr className="adminHr" />
          <AdminOption
            title="Reenable Nominations"
            desc="Allow employees to make nominations again"
            buttonDesc="Abort Lockdown"
            onBtnClick={this.showLockdownConfirmation}
            disabled={!this.state.isLocked}
            dangerous={true}
          />
          <hr className="adminHr" />
          <AdminOption
            title="Clean Restart"
            desc="Clear all award nominations"
            buttonDesc="Reset Nominations"
            onBtnClick={this.showResetConfirmation}
            disabled={false}
            dangerous={true}
          />
        </div>
      </div>
    );
  }

  private showResetConfirmation = () => {
    this.showConfirmationModal(
      "Are you sure you want to reset the state of award nominations?",
      this.resetDatabase
    );
  };

  private resetDatabase = () => {
    const data = {
      lockdown: {
        lockState: false
      }
    };
    firebase
      .database()
      .ref()
      .set(data);
  };

  private showLockdownConfirmation = () => {
    let msg = "Are you sure you want to lock down nominations?";
    if (this.state.isLocked) {
      msg = "Are you sure you want to reenable nominations?";
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
  };

  private readLockState = () => {
    this.state.lockPath.on("value", snap =>
      this.setState({ isLocked: snap!.val().lockState })
    );
  };

  private writeLockState = (lockState: boolean) => {
    const defaultDatabase = firebase.database();
    const lockPath = defaultDatabase.ref("/lockdown");
    return lockPath.set({ lockState });
  };


  private filterTally = () => {
  
    const blob = new Blob(
        this.state.finalTally
      , {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "Tally.csv");
  };

  private exportDatabase = () => {
    const defaultDatabase = firebase.database();
    const ref = defaultDatabase.ref();
    ref.once("value", snapshot => {
      const blob = new Blob([JSON.stringify(snapshot.val())], {
        type: "application/json;charset=utf-8"
      });
      saveAs(blob, "award-nomination-export.json");
    });
  };
}

export default Admin;
