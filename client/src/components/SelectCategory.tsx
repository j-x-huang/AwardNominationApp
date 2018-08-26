import * as React from "react";
import "./../App.css";

class SelectCategory extends React.PureComponent<any, any> {

  constructor(props : any) {
    super(props);
    this.state = {option : ""};
    this.handleClick = this.handleClick.bind(this);
  }

  public render() {
    const categories = [
      "Being Purple",
      "One Small Step",
      "New Horizon",
      "Sky High",
      "Star Crew"
    ];

    return (
      <div id="selectCategory">
        Please select a category for the award nomination.
        {categories.map((c) => (
          <div>
            <button onClick={this.handleClick} value = {c}
             className="category-button">{c}</button>
          </div>
        ))}
      </div>
    );
  }

  private handleClick = (e : any) => {
    this.setState({ 
      option: e.target.value
    });
    alert(e.target.value);
  }


}

export default SelectCategory;
