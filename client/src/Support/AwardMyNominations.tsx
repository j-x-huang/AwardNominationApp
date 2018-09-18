import AwardsContent from "./AwardsContent";
import * as firebase from "firebase";
import { getUser } from "../auth";

class AwardMyNominations extends AwardsContent {
  protected url = "mynominations";
  protected awardTabs = ["My Nominations", "Nominations For Me"];
  // private myNomiationsSnapshot: any[] = [];
  // private nominationsForMeSnapshot: any[] = [];
  // private snapshots: any[] = [];
  // private size = 0;
  // private numChildren = 0;

  public getTabNomination(tab: string, retrieveUserDetails: any) {
    this.getNominations(tab, retrieveUserDetails);
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
  }

  public getNominations = (tab: string, retrieveUserDetails: any) => {
    let path = "nominees";

    console.log("Tab:");
    console.log(tab);
    switch (tab) {
      case "My Nominations":
        path = "nominators";
        break;
      case "Nominations For Me":
        path = "nominees";
        break;
    }
    console.log("path:");
    console.log(path);
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase
      .ref()
      .child(path)
      .child(getUser().profile.oid);
    this.getMyNominations(nomRef, tab, retrieveUserDetails);
  };

  public getMyNominations = (
    nomRef: firebase.database.Reference,
    tab: string,
    retrieveUserDetails: any
  ) => {
    nomRef.once("value", snapshot => {
      console.log("Nominations fetch successful:");
      console.log(tab);
      console.log(snapshot);
      const data = snapshot.val();

      if (data != null) {
        const snapshots: any[] = [];
        const numChildren = snapshot.numChildren();
        let size = 0;
        Object.keys(data).forEach(key => {
          console.log(key);
          // this.getNominationDetails(key, tab, retrieveUserDetails);
          const defaultDatabase = firebase.database();
          const nomRef2 = defaultDatabase.ref();
          nomRef2
            .child("nominations")
            .child(key)
            .once("value", snapshotChild => {
              if (snapshotChild != null) {
                if (retrieveUserDetails != null) {
                  snapshots.push(snapshotChild.val());
                  console.log("Snapshots:");
                  console.log(snapshots);
                  size++;
                  console.log(size);
                  if (size === numChildren) {
                    console.log("Getting nomination details:");
                    console.log(tab);
                    console.log(snapshotChild.val());
                    console.log(snapshots);
                    console.log(retrieveUserDetails(snapshots, tab));
                  }
                }
              }
            });
        });
      }
    });
  };

  // public getNominationDetails(
  //   nominationID: string,
  //   tab: string,
  //   retrieveUserDetails: any
  // ) {
  //   const defaultDatabase = firebase.database();
  //   const nomRef = defaultDatabase.ref();
  //   nomRef
  //     .child("nominations")
  //     .child(nominationID)
  //     .once("value", snapshot => {
  //       if (snapshot != null) {
  //         if (retrieveUserDetails != null) {
  //           this.snapshots.push(snapshot.val());
  //           this.size++;
  //         }
  //         if (this.size === this.numChildren) {
  //           console.log("Getting nomination details:");
  //           console.log(tab);
  //           console.log(this.snapshots);
  //           console.log(retrieveUserDetails(this.snapshots, tab));
  //         }
  //       }
  //     });
  // }
}

export default AwardMyNominations;
