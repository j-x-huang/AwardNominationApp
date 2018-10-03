import * as React from "react";
import * as firebase from "firebase";
import Select from "react-select";
import { getUser } from "../auth";
import { getAllUserDetails } from "../MicrosoftGraphClient";
import NominationComplete from "./NominationComplete";
import Modal from "./NominationModal";
import { Route } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

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

  public allNominees = [{ value: "", name: "", label: "", isDisabled: false }];

  public nomsByCat = {}

  constructor(props: any) {
    super(props);
  }

  public state = {
    categories: [] as any[],
    category: "",
    justification: "",
    nominator: "",
    nominee: { value: "", name: "", label: "", isDisabled: false },
    nominationID: "",
    score: 1,
    nominees: new Array<any>(),
    completed: false,
    isLocked: false,
    colours: [] as string[],
  };

  private readLockState = () => {
    const defaultDatabase = firebase.database();
    const lockPath = defaultDatabase.ref("/lockdown");
    lockPath.once("value").then(value => {
      this.setState({ isLocked: value.val().lockState });
      return value.val().lockState;
    });
  };

  public updateNomineeList = (category: string) => {
    let neoNominees = [{ value: "", name: "", label: "", isDisabled: false }];
    let actualNominees = new Array<any>();

    if (this.nomsByCat.hasOwnProperty(category)) {
      neoNominees = this.allNominees.filter(
        staff =>
          this.nomsByCat[category].indexOf(staff.value) === -1 &&
          staff.value !== getUser().profile.oid
      )
      actualNominees = this.allNominees.filter(
        staff =>
          this.nomsByCat[category].indexOf(staff.value) > -1 &&
          staff.value !== getUser().profile.oid
      );
    }

    actualNominees.forEach(nom => {
      nom.label = nom.name + " (nominated)";
      nom.isDisabled = false;
    });

    neoNominees.forEach(nom => {
      nom.label = nom.name;
      nom.isDisabled = false;
    });

    const superNominees = actualNominees.concat(neoNominees);
    this.setState({ nominees: superNominees });
  };

  public categoryChange = (event: any) => {
    const cat = event.target.value;
    this.setState({ category: cat });
    this.setState({ nominee: { value: "", name: "", label: "" } });
    this.updateNomineeList(cat);
  };

  public nomineeChange = (nominee: any) => {
    this.setState({ nominee });
  };

  public justificationChange = (event: any) => {
    this.setState({ justification: event.target.value });
  };

  public componentDidMount() {
    this.readLockState();
    getAllUserDetails((err, usersDetails) => {
      if (err) {
        // TODO
      } else {
        this.allNominees = usersDetails.map((suggestion: any) => ({
          value: suggestion.id,
          name: suggestion.name,
          label: suggestion.name,
          isDisabled: false
        }));
        this.setState({ nominees: [...this.allNominees] });
      }
    });
    const defaultDatabase = firebase.database();
    const catRef = defaultDatabase.ref("category");
    catRef.once("value", snapshot => {
      const cats = [] as any[];
      const tempColours = [] as string[];
      snapshot.forEach(childSnapshot => {
        const item = childSnapshot.val().name;
        const colour = childSnapshot.val().color;
        cats.push(item);
        tempColours.push(colour);
      });
      this.setState({
        categories: cats,
        colours: tempColours
      }
      );
      cats.map((data) => {
        this.nomsByCat[data] = []
      })
      this.getNominationByCategory();
    });
  }

  public render() {
    const { category, nominee, nominees, completed } = this.state;
    const options = this.state.categories.map((loan, key) => {
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
              style={isCurrent ? 
                { background: this.state.colours[key], borderColor: this.state.colours[key], opacity: 1} :
                { background: this.state.colours[key], borderColor: this.state.colours[key], opacity: 0.8}
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
            nominee={
              nominee.label.includes(" (nominated)")
                ? nominee.label.replace(" (nominated)", "")
                : nominee.label
            }
            onClick={this.redirectToNomination}
          />
        ) : (
            <form className="feelix-card" id="nominateDiv">
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
                  className="btn btn-primary btn-purple float-right"
                  disabled={this.checkFieldsFilled() ? false : true}
                  onClick={this.handleClick}
                  style={this.state.isLocked ? { display: "none" } : {}}
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
    // console.log("SADFASDFSA");
    // this.setState({
    //   completed: true
    // });
  };

  private setNominationID = (ID: string) => {
    this.setState({
      nominationID: ID
    });
  };

  public getNominationByCategory() {
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref();
    nomRef.child("categories").once("value", snapshot => {
      if (snapshot != null) {
        snapshot.forEach(childSnapshot => {
          if (childSnapshot != null) {
            const categoryName: string = "" + childSnapshot.key
            if (this.nomsByCat.hasOwnProperty(categoryName)) {
              Object.keys(childSnapshot.val()).forEach(key => {
                this.nomsByCat[categoryName].push(key)
              });
            }
          }
        });
      }
    });
  }

  private redirectToNomination = () => {
    this.props.history.push({
      pathname: "/nominate/nomination/" + this.state.nominationID,
      state: { modal: true }
    });
  };

  public openModal = () => {
    return (
      <div>
        <Modal nominationID={this.state.nominationID} />
      </div>
    );
  };

  private makeNomination = () => {
    const defaultDatabase = firebase.database();
    const category = this.state.category;
    const nominee = this.state.nominee.value;

    let duplicateNomination = false;

    // Check if nomination exists
    defaultDatabase
      .ref("nominations/")
      .once("value")
      .then(snap => {
        const array = snap.val();
        if (array != null) {
          for (const existingNominationPostKey of Object.keys(array)) {
            const existingNomination = array[existingNominationPostKey];
            if (
              existingNomination.category === category &&
              existingNomination.nominee === nominee
            ) {
              this.setNominationID(existingNominationPostKey);
              this.showDuplicateNominationConfirmationModal(
                existingNominationPostKey
              );
              duplicateNomination = true;
              break;
            }
          }
        }
        if (!duplicateNomination) {
          const newPostKey = defaultDatabase
            .ref()
            .child("nominations")
            .push().key;

          if (newPostKey != null) {
            this.setNominationID(newPostKey);
            this.showNominationConfirmationModal(newPostKey);
          }
        }
      });
  };

  private showNominationConfirmationModal = (newPostKey: string) => {
    const defaultDatabase = firebase.database();
    confirmAlert({
      title: "Confirm your Nomination",
      message: "Are you sure you want to nominate?",
      buttons: [
        {
          label: "Nominate",
          onClick: () => this.createNewNomination(defaultDatabase, newPostKey)
        },
        {
          label: "Cancel"
        }
      ]
    });
  };

  private showDuplicateNominationConfirmationModal = (
    existingNominationPostKey: string
  ) => {
    confirmAlert({
      title: "Nomination Already Exists!",
      message: "Do you want to put your justification as a comment?",
      buttons: [
        {
          label: "Comment",
          onClick: () =>
            this.duplicateNominationJustificationToComment(
              existingNominationPostKey
            )
        },
        {
          label: "Cancel"
        }
      ]
    });
  };

  private duplicateNominationJustificationToComment(
    existingNominationPostKey: string
  ) {
    this.makeComment(existingNominationPostKey, this.state.justification);
    this.makeUpvote(existingNominationPostKey);
    this.setState({
      completed: true
    });
    this.redirectToNomination();
  }

  private createNewNomination = (
    defaultDatabase: firebase.database.Database,
    newPostKey: string
  ) => {

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
      },
      key: newPostKey
    };

    if (newPostKey != null) {
      const nomination = {
        [newPostKey]: true
      };
      const nominatorPath = defaultDatabase.ref("nominators/" + userid);
      const nomineePath = defaultDatabase.ref("nominees/" + nomineeid);

      nominatorPath.update(nomination);
      nomineePath.update(nomination);
    }

    const nomCat = {
      [nomineeid]: true
    };
    const nomCatPath = defaultDatabase.ref(
      "/categories/" + this.state.category
    );

    nomCatPath.update(nomCat);

    defaultDatabase.ref().update(updates);
    this.setState({
      completed: true
    });
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

    const nominatorPath = defaultDatabase.ref("nominators/" + uid);
    const nomination = {
      [nominationPostKey]: true
    };

    nominatorPath.update(nomination);

    return upvoterPath.update(upvoter);
  };
}

export default NominationForm;
