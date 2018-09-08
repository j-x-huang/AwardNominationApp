import * as React from "react";
import * as firebase from "firebase";
import Select from "react-select";
import { getUser } from "../auth";
import { getAllUserDetails } from "../MicrosoftGraphClient";
import NominationComplete from "./NominationComplete";

class NominationForm extends React.Component<any, any> {
  public allNominees = [{ value: "", label: "" }];
  public categories = [
    "Being Purple",
    "One Small Step",
    "New Horizon",
    "Sky High",
    "Star Crew"
  ];
  public beingPurple = [] as any[];
  public oneSmallStep = [] as any[];
  public newHorizon = [] as any[];
  public skyHigh = [] as any[];
  public starCrew = [] as any[];

  constructor(props: any) {
    super(props);
  }

  public state = {
    category: "",
    justification: "",
    nominator: "",
    nominee: { value: "", label: "" },
    score: 1,
    nominees: new Array<any>(),
    completed: false
  };

  public updateNomineeList = (category: string) => {
    let neoNominees = [{ value: "", label: "" }];
    const selection = this.categories.indexOf(category);
    console.log(selection);
    if (selection === 0) {
      neoNominees = this.allNominees.filter(
        staff => this.beingPurple.indexOf(staff.value) === -1
      );
      console.log(neoNominees);
    } else if (selection === 1) {
      neoNominees = this.allNominees.filter(
        staff => this.oneSmallStep.indexOf(staff.value) === -1
      );
      console.log(neoNominees);
    } else if (selection === 2) {
      neoNominees = this.allNominees.filter(
        staff => this.newHorizon.indexOf(staff.value) === -1
      );
      console.log(neoNominees);
    } else if (selection === 3) {
      neoNominees = this.allNominees.filter(
        staff => this.skyHigh.indexOf(staff.value) === -1
      );
      console.log(neoNominees);
    } else if (selection === 4) {
      neoNominees = this.allNominees.filter(
        staff => this.starCrew.indexOf(staff.value) === -1
      );
      console.log(neoNominees);
    }
    this.setState({ nominees: neoNominees });
  };

  public categoryChange = (event: any) => {
    const cat = event.target.value;
    this.setState({ category: cat });
    this.setState({ nominee: { value: "", label: "" } });
    this.updateNomineeList(cat);
  };

  public nomineeChange = (nominee: any) => {
    console.log(nominee);
    this.setState({ nominee });
  };

  public justificationChange = (event: any) => {
    this.setState({ justification: event.target.value });
  };

  public componentDidMount() {
    getAllUserDetails((err, usersDetails) => {
      if (err) {
        // TODO
      } else {
        this.allNominees = usersDetails.map((suggestion: any) => ({
          value: suggestion.id,
          label: suggestion.name
        }));
        console.log([...this.allNominees]);
        this.setState({ nominees: [...this.allNominees] });
      }
    });
    this.getNominationByCategory();
  }

  public render() {
    const { category, nominee, nominees, completed } = this.state;
    return (
      <div>
        {completed ? (
          <NominationComplete category={category} nominee={nominee.label} />
        ) : (
            <form className="feelix-card">
              <h5> Nominate a deserving candidate </h5>
              <hr />
              <div className="form-group">
                <label htmlFor="categorySelect">Select an award category</label>
                <select
                  className="form-control"
                  id="categorySelect"
                  value={this.state.category}
                  onChange={this.categoryChange}
                >
                  <option />
                  <option>{this.categories[0]}</option>
                  <option>{this.categories[1]}</option>
                  <option>{this.categories[2]}</option>
                  <option>{this.categories[3]}</option>
                  <option>{this.categories[4]}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="nomineeeSelect">Select a fellow staff</label>
                <Select
                  isDisabled={category === ""}
                  isSearchable={true}
                  onChange={this.nomineeChange}
                  options={nominees}
                  value={this.state.nominee}
                />
              </div>
              <div className="form-group">
                <label htmlFor="justificationSelect">Justify your decision</label>
                <textarea
                  className="form-control"
                  style={{ resize: "none" }}
                  id="justificationSelect"
                  rows={5}
                  value={this.state.justification}
                  onChange={this.justificationChange}
                />
              </div>
              <div className="overflowHid">
                <button
                  type="button"
                  className="btn btn-primary float-right"
                  disabled={this.checkFieldsFilled() ? false : true}
                  onClick={this.handleClick}
                >
                  Nominate
              </button>
              </div>
            </form>
          )}
      </div>
    );
  }

  private checkFieldsFilled = () => {
    if (
      this.state.category === "" ||
      this.state.nominee.value === "" ||
      this.state.nominee.label === "" ||
      this.state.justification.trim() === ""
    ) {
      return false;
    }
    return true;
  };

  private handleClick = () => {
    this.makeNomination();
    this.setState({
      completed: true
    });
  };

  public getNominationByCategory() {
    const returnArr: object[] = [];

    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref();
    nomRef.child("categories").once("value", snapshot => {
      if (snapshot != null) {
        snapshot.forEach(childSnapshot => {
          if (childSnapshot != null) {
            switch (childSnapshot.key) {
              case "Being Purple":
                Object.keys(childSnapshot.val()).forEach(key => {
                  this.beingPurple.push(key);
                });
                break;
              case "One Small Step":
                Object.keys(childSnapshot.val()).forEach(key => {
                  this.oneSmallStep.push(key);
                });
                break;
              case "New Horizon":
                Object.keys(childSnapshot.val()).forEach(key => {
                  this.newHorizon.push(key);
                });
                break;
              case "Sky High":
                Object.keys(childSnapshot.val()).forEach(key => {
                  this.skyHigh.push(key);
                });
                break;
              case "Star Crew":
                Object.keys(childSnapshot.val()).forEach(key => {
                  this.starCrew.push(key);
                });
                break;
            }

            const cat = {
              category: childSnapshot.key,
              nominees: childSnapshot.val()
            };
            returnArr.push(cat);
          }
        });
        console.log(returnArr);
      }
      return returnArr;
    });
  }

  private makeNomination = () => {
    const defaultDatabase = firebase.database();

    // Get a key for a new Post.
    const newPostKey = defaultDatabase
      .ref()
      .child("nominations")
      .push().key;

    const user = getUser();
    const userid = user.profile.oid;
    const nomineeid = this.state.nominee.value;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};

    updates["/nominations/" + newPostKey] = {
      category: this.state.category,
      justification: this.state.justification,
      nominator: userid,
      nominee: nomineeid,
      score: 1
    };
    updates["/nominators/" + userid + "/" + newPostKey] = {
      nomination_id: newPostKey,
      nominee: this.state.nominee.value
    };
    updates["/nominees/" + nomineeid + "/" + newPostKey] = {
      nomination_id: newPostKey,
      nominator: userid
    };

    const nomCat = {
      [nomineeid]: true
    };
    const nomCatPath = defaultDatabase.ref(
      "/categories/" + this.state.category
    );

    nomCatPath.update(nomCat);

    return defaultDatabase.ref().update(updates);
  };
}

export default NominationForm;
