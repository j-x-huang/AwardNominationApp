import * as React from "react";
import "./AdminResetDialog.css";
import CategoryTile from "./CategoryTile";
import * as firebase from "firebase";

export interface IAdminResetDialog {
  // the function to call to close the dialog
  onClose: any;
}

class AdminResetDialog extends React.Component<IAdminResetDialog, any> {
  public state = {
    newCategory: "",
    // TODO populate this at launch
    categories: [
      { name: "Being Purple", color: "#D0DB97" },
      { name: "One Small Step", color: "#69B578" },
      { name: "New Horizon", color: "#3A7D44" },
      { name: "Sky High", color: "#254D32" },
      { name: "Star Crew", color: "#181D27" }
    ]
  };

  // change the color for a specific category
  private handleColorChange = (cat: any) => {
    const dCategories = [...this.state.categories];
    const index = dCategories.indexOf(cat);
    dCategories[index] = { ...cat };
    dCategories[index].color = cat.color;
    this.setState({ categories: dCategories });
  };

  // handle deletion of a specific category
  private handleDelete = (cat: any) => {
    const dCategories = this.state.categories.filter(c => c.name !== cat.name);
    this.setState({ categories: dCategories });
  };

  // handle change in "Add New Category" field
  private handleNewCategoryChange = (event: any) => {
    this.setState({ newCategory: event.target.value });
  };

  // Listen to enter key for addition of new category and assign it a random color,
  // existing category names and "" are not allowed
  private handleEnterKeyPress = (event: any) => {
    if (
      (event.keyCode === 13 || event.charCode === 13) &&
      this.state.newCategory !== ""
    ) {
      if (
        this.state.categories.filter(c => c.name === this.state.newCategory)
          .length === 0
      ) {
        event.preventDefault();
        const randomColor =
          "#" +
          Math.random()
            .toString(16)
            .substr(-6);
        const newCat = { name: this.state.newCategory, color: randomColor };
        const newCategories = [newCat, ...this.state.categories];
        this.setState({ categories: newCategories, newCategory: "" });
      } else {
        this.setState({ newCategory: "" });
      }
    }
  };

  // reset the databsase with new categories
  private resetDatabase = () => {
    // TODO set the new categories and colors too
    const data = {
      lockdown: {
        lockState: false
      }
    };
    firebase
      .database()
      .ref()
      .set(data);
    this.props.onClose();
  };

  public render() {
    return (
      <div className="reset-dialog react-confirm-alert-body">
        <h1>Reset award nomination state</h1>
        <p>Current categories:</p>
        <div className="category-container">
          {this.state.categories.map(cat => (
            <CategoryTile
              key={cat.name}
              category={cat}
              onDelete={this.handleDelete}
              onColorChange={this.handleColorChange}
            />
          ))}
        </div>
        <input
          style={{
            resize: "none",
            marginTop: "1em",
            textAlign: "center",
            borderStyle: "dashed"
          }}
          className="textarea form-control"
          placeholder="+ Add New Category"
          value={this.state.newCategory}
          onChange={this.handleNewCategoryChange}
          onKeyPress={this.handleEnterKeyPress}
        />
        <div className="react-confirm-alert-button-group">
          <button className="reset-btn" onClick={this.resetDatabase}>
            Confirm
          </button>
          <button className="reset-btn" onClick={this.props.onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default AdminResetDialog;
