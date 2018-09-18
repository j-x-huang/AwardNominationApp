import AwardsContent from "./AwardsContent";
import * as firebase from "firebase";
import { getUser } from "../auth";

class AwardMyNominations extends AwardsContent {
  protected url = "mynominations";
  protected awardTabs = ["My Nominations", "Nominations For Me"];
  private tab = "";
  private retrieveUserDetails: any;
  private snapshots: any[] = [];
  private size = 0;
  private numChildren = 0;

  public getTabNomination(tab: string, retrieveUserDetails: any) {
    this.tab = tab;
    this.retrieveUserDetails = retrieveUserDetails;

    // const defaultDatabase = firebase.database();
    // const nomRef = defaultDatabase.ref();
    // nomRef
    //   .child("nominations")
    //   .orderByChild("category")
    //   .equalTo("Sky High")
    //   .once("value", snapshot => {
    //     if (snapshot != null) {
    //       console.log(retrieveUserDetails(snapshot));
    //     }
    //   });
    this.getNominations();
  }

  public getNominations = () => {
    let path = "nominees";

    switch (this.tab) {
      case "My Nominations":
        path = "nominators";
        break;
      case "Nominations For Me":
        path = "nominees";
        break;
    }
    console.log(path);
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase
      .ref()
      .child(path)
      .child(getUser().profile.oid);
    this.getMyNominations(nomRef);
  };

  public getMyNominations = (nomRef: firebase.database.Reference) => {
    nomRef.once("value", snapshot => {
      console.log(snapshot);
      const data = snapshot.val();

      if (data != null) {
        this.numChildren = snapshot.numChildren();
        Object.keys(data).forEach(key => {
          console.log(key);
          this.getNominationDetails(key);
        });
      }
    });
  };

  public getNominationDetails(nominationID: string) {
    console.log("Function called");

    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref();
    nomRef
      .child("nominations")
      .child(nominationID)
      .once("value", snapshot => {
        if (snapshot != null) {
          if (this.retrieveUserDetails != null) {
            this.snapshots.push(snapshot.val());
            this.size++;
          }
          if (this.size === this.numChildren) {
            console.log(this.snapshots);
            console.log(this.retrieveUserDetails(this.snapshots, this.tab));
          }
        }
      });
  }
}

export default AwardMyNominations;
