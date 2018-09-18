import AwardsContent from "./AwardsContent";
import * as firebase from "firebase";

class AwardMyNominations extends AwardsContent {
  protected url = "mynominations";
  protected awardTabs = ["My Nominations", "Nominations For Me"];

  public getTabNomination(tab: string, retrieveUserDetails: any) {
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref();
    nomRef
      .child("nominations")
      .orderByChild("category")
      .equalTo("Sky High")
      .once("value", snapshot => {
        if (snapshot != null) {
          console.log(retrieveUserDetails(snapshot, tab));
        }
      });
  }
}

export default AwardMyNominations;
