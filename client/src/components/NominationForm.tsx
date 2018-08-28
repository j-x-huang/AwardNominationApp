import * as React from "react";
import * as firebase from "firebase";
import { getUser } from "../auth";
class NominationForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public state = {
    category: "",
    justification: "",
    nominator: "u",
    nominee: "",
    score: 1
  };

  public categoryChange = (event: any) => {
    const cat = event.target.value;
    this.setState({ category: cat });
    this.setState({ nominee: "" });
  };

  public nomineeChange = (event: any) => {
    this.setState({ nominee: event.target.value });
  };

  public justificationChange = (event: any) => {
    this.setState({ justification: event.target.value });
  };

  public render() {
    const { category } = this.state;

    return (
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
          <input
            className="form-control"
            id="nomineeeSelect"
            disabled={category === ""}
            value={this.state.nominee}
            onChange={this.nomineeChange}
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
        <button type="button" className="btn btn-primary float-right" onClick={this.makeNomination}>
          Nominate
        </button>
      </form>
    );
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
    // const nomineeid = ;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};

    updates["/nominations/" + newPostKey] = this.state;
    updates["/nominators/" + userid + "/" + newPostKey] = {
      nomination_id: newPostKey,
      nominee: this.state.nominee
    };
    // updates['/nominees/' + nomineeid + "/" + newPostKey] = {nomination_id: newPostKey, nominator: user.profile.name};

    return defaultDatabase.ref().update(updates);
  };
}

export default NominationForm;
