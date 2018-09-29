import AwardsContent from "./AwardsContent";
import * as firebase from "firebase";

class AwardCategories extends AwardsContent {
  protected url = "awards";
  protected awardTabs = [
    "All",
  ];

  public updateAwardTabs(callback: (awardTabs: any) => void) {
    const defaultDatabase = firebase.database()
    console.log("1")
    const catRef = defaultDatabase.ref("category");
    console.log("2")
    catRef.once("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        const item = childSnapshot.val().name;
        console.log("ITEM------" + item)
        this.awardTabs.push(item);
      });
      callback(this.awardTabs)
    });
  }

  public getTabNomination(tab: string, retrieveUserDetails: any) {
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref();

    if (tab === "All") {
      nomRef
        .child("nominations")
        .orderByChild("category")
        .once("value", snapshot => {
          if (snapshot != null) {
            console.log(snapshot.val());
            console.log(retrieveUserDetails(snapshot, tab));
          }
        });
    } else {
      nomRef
        .child("nominations")
        .orderByChild("category")
        .equalTo(tab)
        .once("value", snapshot => {
          if (snapshot != null) {
            console.log(retrieveUserDetails(snapshot, tab));
          }
        });
    }
  }
}

export default AwardCategories;
