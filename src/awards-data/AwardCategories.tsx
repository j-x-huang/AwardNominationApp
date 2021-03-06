import AwardsContent from "./AwardsContent";
import * as firebase from "firebase";

class AwardCategories extends AwardsContent {
  protected url = "awards";
  protected awardTabs = [
    "All",
  ];

  public updateAwardTabs(callback: (awardTabs: any) => void) {
    const defaultDatabase = firebase.database()
    const catRef = defaultDatabase.ref("category");
    catRef.once("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        const item = childSnapshot.val().name;
        this.awardTabs.push(item);
      });
      callback(this.awardTabs)
    });
  }

  public getTabNomination(tab: string, retrieveUserDetails: any) {
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref();
    const catRef = defaultDatabase.ref("category");

    catRef.once("value", snapshot => {
      const categoryColors = [] as any[];

      snapshot.forEach(childSnapshot => {
        const item = childSnapshot.val().name;
        const color = childSnapshot.val().color;
        categoryColors[item] = color;
      });

      if (tab === "All") {
        nomRef
          .child("nominations")
          .orderByChild("category")
          .once("value", nomSnapshot => {
            if (nomSnapshot != null) {
              console.log(nomSnapshot.val());
              console.log(retrieveUserDetails(nomSnapshot, tab, categoryColors));
            }
        });
      } else {
        nomRef
          .child("nominations")
          .orderByChild("category")
          .equalTo(tab)
          .once("value", nomSnapshot => {
            if (nomSnapshot != null) {
              console.log(retrieveUserDetails(nomSnapshot, tab, categoryColors));
            }
          });
      }
    });
  }
}

export default AwardCategories;
