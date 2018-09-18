import AwardsContent from "./AwardsContent";
import * as firebase from "firebase";

class AwardCategories extends AwardsContent {
  protected url = "awards";
  protected awardTabs = [
    "All",
    "Being Purple",
    "One Small Step",
    "New Horizon",
    "Sky High",
    "Star Crew"
  ];

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
