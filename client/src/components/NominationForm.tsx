import * as React from "react";
import * as firebase from "firebase";
import Select from "react-select";
import { getUser } from "../auth";
import { getAllUserDetails } from "../MicrosoftGraphClient";
import NominationComplete from "./NominationComplete";

class NominationForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public state = {
    category: "",
    justification: "",
    nominator: "u",
    nominee: { value: "", label: "" },
    score: 1,
    nominees: new Array<any>(),
    completed: false
  };

  public categoryChange = (event: any) => {
    const cat = event.target.value;
    this.setState({ category: cat });
    this.setState({ nominee: "" });
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
        const nominees = usersDetails.map((suggestion: any) => ({
          value: suggestion.id,
          label: suggestion.name
        }));
        this.setState({ nominees });
      }
    });
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
                  <option>Being Purple</option>
                  <option>One Small Step</option>
                  <option>New Horizon</option>
                  <option>Sky High</option>
                  <option>Star Crew</option>
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
              <button
                type="button"
                className="btn btn-primary float-right"
                onClick={this.handleClick}
              >
                Nominate
            </button>
            </form>
          )}
      </div>
    );
  }

  private handleClick = () => {
    this.makeNomination();
    this.setState({
      completed: true
    });
  };

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

    return defaultDatabase.ref().update(updates);
  };
}

export default NominationForm;
