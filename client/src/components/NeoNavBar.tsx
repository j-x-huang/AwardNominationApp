import * as React from "react";
import logo1 from "../images/logo1.png";
export interface INavBarProps {
  selection: number;
}

class NavBar extends React.Component<INavBarProps, any> {
  public render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img src={logo1} height="24" alt="" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">
                <span className={this.getLinkClass(0)}>HOME</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/awards">
                <span className={this.getLinkClass(1)}>AWARDS</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/nominate">
                <span className={this.getLinkClass(2)}>NOMINATE</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                <span className={this.getLinkClass(3)}>MY NOMINATIONS</span>
              </a>
            </li>
          </ul>
          <ul className="nav navbar-nav ml-auto">
            <li>
              <div className="inset">
                <img src="https://i.pinimg.com/originals/01/e7/e2/01e7e206ff9a0b29fb4bac269140dda6.jpg" />
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  private getLinkClass(position: number) {
    let classes = "";
    console.info("Query " + position);
    console.info("Actual " + this.props.selection);

    classes += this.props.selection === position ? "activeSpan" : "justASpan";
    return classes;
  }
}
export default NavBar;
