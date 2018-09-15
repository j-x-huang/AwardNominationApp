import * as React from "react";
import * as firebase from "firebase";
import Select from "react-select";
import { getUser } from "../auth";
import { getAllUserDetails } from "../MicrosoftGraphClient";
import NominationComplete from "./NominationComplete";
import Modal from "./NominationModal";
import { Route } from "react-router-dom";

class NominationForm extends React.Component<any, any> {
  public previousLocation = this.props.location;

  public componentWillUpdate(nextProps: any) {
    const { location } = this.props;
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  public allNominees = [{ value: "", label: "", isDisabled: false }];
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
    nominee: { value: "", label: "", isDisabled: false },
    nominationID: "-LM4wBg-yv0zNphsbcMz",
    score: 1,
    nominees: new Array<any>(),
    completed: false
  };

  public updateNomineeList = (category: string) => {
    let neoNominees = [{ value: "", label: "", isDisabled: false }];
    let actualNominees = new Array<any>();

    const selection = this.categories.indexOf(category);
    console.log(selection);
    if (selection === 0) {
      neoNominees = this.allNominees.filter(
        staff => this.beingPurple.indexOf(staff.value) === -1
      );
      actualNominees = this.allNominees.filter(
        staff => this.beingPurple.indexOf(staff.value) > -1
      );
    } else if (selection === 1) {
      neoNominees = this.allNominees.filter(
        staff => this.oneSmallStep.indexOf(staff.value) === -1
      );
      actualNominees = this.allNominees.filter(
        staff => this.oneSmallStep.indexOf(staff.value) > -1
      );
    } else if (selection === 2) {
      neoNominees = this.allNominees.filter(
        staff => this.newHorizon.indexOf(staff.value) === -1
      );
      actualNominees = this.allNominees.filter(
        staff => this.newHorizon.indexOf(staff.value) > -1
      );
    } else if (selection === 3) {
      neoNominees = this.allNominees.filter(
        staff => this.skyHigh.indexOf(staff.value) === -1
      );
      actualNominees = this.allNominees.filter(
        staff => this.skyHigh.indexOf(staff.value) > -1
      );
    } else if (selection === 4) {
      neoNominees = this.allNominees.filter(
        staff => this.starCrew.indexOf(staff.value) === -1
      );
      actualNominees = this.allNominees.filter(
        staff => this.starCrew.indexOf(staff.value) > -1
      );
    }

    actualNominees.forEach(nom => {
      nom.label = nom.label + ' (nominated) ';
      nom.isDisabled = false;
    });

    neoNominees.forEach(nom => {
      nom.isDisabled = false;
    });

    const superNominees = actualNominees.concat(neoNominees);
    console.log(superNominees);
    this.setState({ nominees: superNominees });
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
          label: suggestion.name,
          isDisabled: false
        }));
        console.log([...this.allNominees]);
        this.setState({ nominees: [...this.allNominees] });
      }
    });
    this.getNominationByCategory();
  }

  public render() {
    const { category, nominee, nominees, completed } = this.state;
    const options = this.categories.map((loan, key) => {
      const isCurrent = this.state.category === loan;
      return (
        <div key={key} className="radioPad">
          <div>
            <label
              className={
                isCurrent
                  ? "radioPad__wrapper radioPad__wrapper--selected"
                  : "radioPad__wrapper"
              }
            >
              <input
                className="radioPad__radio"
                type="radio"
                name="categories"
                id={loan}
                value={loan}
                onChange={this.categoryChange}
              />
              {loan}
            </label>
          </div>
        </div>
      );
    });
    return (
      <div>
        {completed ? (
          <NominationComplete
            category={category}
            nominee={nominee.label}
            onClick={this.redirectToNomination}
          />
        ) : (
          <form className="feelix-card">
            <h5> Nominate a deserving candidate </h5>
            <hr />
            <div id="categorySelect">{options}</div>
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
        <Route
          path={"/nominate/nomination/" + this.state.nominationID}
          render={this.openModal}
        />
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

  private setNominationID = (id: string | null) => {
    this.setState({
      nominationID: id
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

  private redirectToNomination = () => {
    this.props.history.push({
      pathname: "/nominate/nomination/" + this.state.nominationID,
      state: { modal: true }
    });
  };

  public goBack = () => {
    this.props.history.push("/nominate");
  };

  public openModal = () => {
    return (
      <div>
        <Modal nominationID={this.state.nominationID} onClose={this.goBack} />
      </div>
    );
  };

  private makeNomination = () => {
    const defaultDatabase = firebase.database();
    const category = this.state.category;
    const nominee = this.state.nominee.value;

    // Check if nomination exist
    defaultDatabase
      .ref("nominations/")
      .once("value")
      .then(snap => {
        const array = snap.val();
        // console.log(array);
        for (const existingNominationPostKey of Object.keys(array)) {
          const existingNomination = array[existingNominationPostKey];
          if (
            existingNomination.category === category &&
            existingNomination.nominee === nominee
          ) {
            console.log(existingNominationPostKey);
            this.makeComment(
              existingNominationPostKey,
              this.state.justification
            );
            this.makeUpvote(existingNominationPostKey);
            this.setNominationID(existingNominationPostKey);
            this.redirectToNomination();
            // TODO: redirect to comment page
          }
        }
        this.createNewNomination(defaultDatabase);
      });
  };

  private createNewNomination = (
    defaultDatabase: firebase.database.Database
  ) => {
    // Get a key for a new Post.
    const newPostKey = defaultDatabase
      .ref()
      .child("nominations")
      .push().key;

    const nomineeid = this.state.nominee.value;
    const user = getUser();
    const userid = user.profile.oid;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};

    updates["/nominations/" + newPostKey] = {
      category: this.state.category,
      justification: this.state.justification,
      nominator: userid,
      nominee: nomineeid,
      upvoters: {
        [userid]: true
      }
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

    this.setNominationID(newPostKey);

    return defaultDatabase.ref().update(updates);
  };

  private makeComment = (nominationPostKey: string, justification: string) => {
    const defaultDatabase = firebase.database();
    const nominationid = nominationPostKey;

    const newPostKey = defaultDatabase
      .ref()
      .child("/nominations/" + nominationid + "/comments/")
      .push().key;

    const user = getUser();

    const comment = {
      comment: justification,
      commenter: user.profile.oid
    };
    const updates = {};
    updates[
      "/nominations/" + nominationid + "/comments/" + newPostKey
    ] = comment;

    return defaultDatabase.ref().update(updates);
  };

  private makeUpvote = (nominationPostKey: string) => {
    const defaultDatabase = firebase.database();

    const nominationid = nominationPostKey;
    const user = getUser();
    const uid = user.profile.oid;

    const upvoter = {
      [uid]: true
    };

    const upvoterPath = defaultDatabase.ref(
      "/nominations/" + nominationid + "/upvoters/"
    );

    return upvoterPath.update(upvoter);
  };
  /*
    private removeUpvote = (nominationPostKey: string) => {
      const defaultDatabase = firebase.database();
  
      const nominationid = nominationPostKey;
      const user = getUser();
      const uid = user.profile.oid;
  
      const upvoterPath = defaultDatabase.ref(
        "/nominations/" + nominationid + "/upvoters/" + uid
      );
  
      return upvoterPath.remove();
    };*/
}

export default NominationForm;
