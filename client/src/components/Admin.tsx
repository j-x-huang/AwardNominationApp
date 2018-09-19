import * as React from "react";
import "../App.css";
import * as firebase from "firebase";
import { confirmAlert } from "react-confirm-alert";
import AdminOption from "./AdminOption";
import { saveAs } from "file-saver/FileSaver";
import { getUsersByObjectId } from "../MicrosoftGraphClient";

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
    finalTally: ["Category,Name,Tally\n"] as any
  };

  public csvLine(category: string, name: string, tally: number) {
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
            desc="Export nominations of each category"
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
    const defaultDatabase = firebase.database();
    const ref = defaultDatabase.ref("nominations");
    ref.once("value", snapshot => {
      const nominees: string[] = [];

      snapshot.forEach(nomination => {
        const item = nomination.val();

        if (nominees.indexOf(item.nominee) === -1) {
          nominees.push(item.nominee);
        }
      });

      getUsersByObjectId(nominees, (err, users) => {
        console.log(users);
        snapshot.forEach(nomination => {
          const item = nomination.val();
          const category = item.category;
          const name = users[item.nominee].name;
          let tally = 0;
          if (item.upvoters != null) {
            tally = Object.keys(item.upvoters).length;
          }
          this.csvLine(category, name, tally);
        });

        this.state.finalTally.sort(this.sortByTally);
        const blob = new Blob(this.state.finalTally, {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, "Tally.csv");
      });
    });
  };

  private sortByTally(a: string,b: string) {
    const aArr = a.split(',');
    const bArr = b.split(',');
    // Sorting by tally number
    if (aArr[2] < bArr[2]) {
        return 1;
    } else if (aArr[2] > bArr[2] ){
        return -1;
    // Sorting by Category in Alphabetical order
    } else if (aArr[2] === bArr[2] && aArr[0] < bArr[0]){
        return -1;
    } else if (aArr[2] === bArr[2] && aArr[0] > bArr[0]){
      return 1;
    // Sorting by Name in Alphabetical order 
  } else if (aArr[2] === bArr[2] && aArr[1] < bArr[1]){
    return -1;
  } else if (aArr[2] === bArr[2] && aArr[1] > bArr[1]){
      return 1;
  } else {
    return 0;
  }
}

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
