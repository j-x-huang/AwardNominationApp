import * as React from "react";
import "./AdminResetDialog.css";
import CategoryTile from "./CategoryTile";

class AdminResetDialog extends React.Component<any, any> {
  public state = {
    counters: [
      { category: "Being Purple", color: "#D0DB97" },
      { category: "One Small Step", color: "#69B578" },
      { category: "New Horizon", color: "#3A7D44" },
      { category: "Sky High", color: "#254D32" },
      { category: "Star Crew", color: "#181D27" }
    ]
  };

  public render() {
    return (
      <div className="reset-dialog react-confirm-alert-body">
        <h1>Reset award nomination state</h1>
        <p>Current categories:</p>
        <div className="category-container">
          <CategoryTile />
          <CategoryTile />
          <CategoryTile />
          <CategoryTile />
          <CategoryTile />
        </div>
        <textarea
          style={{
            resize: "none",
            marginTop: "1em",
            textAlign: "center",
            borderStyle: "dashed"
          }}
          className="textarea form-control"
          placeholder="+ Add New Category"
          rows={1}
        />
        {/* // value={comment}
          // onChange={onCommentChange}
          // onKeyPress={this.handleEnterKeyPress} */}
        <div className="react-confirm-alert-button-group">
          <button className="reset-btn" onClick={this.props.onClose}>
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
