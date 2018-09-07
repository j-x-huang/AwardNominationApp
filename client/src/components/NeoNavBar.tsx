import * as React from "react";
import logo1 from "../images/logo1.png";
import { getUser, logOutUser } from "../auth";
import { getMyImage } from "../MicrosoftGraphClient";
import { Link } from 'react-router-dom';

export interface INavBarProps {
  selection: number;
}

class NavBar extends React.Component<INavBarProps, any> {
  public state = {
    profilePic:
      "http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg"
  };

  public componentDidMount() {
    getMyImage((picUrl, err) => {
      if (err) {
        // nothing
      } else {
        this.setState({
          profilePic: picUrl
        });
      }
      return;
    });
  }

  public render() {
    const user = getUser();
    const profileName = user.profile.name
      .split(" ")
      .slice(0, -1)
      .join(" ");
    // const profilePicUrl ="https://i.pinimg.com/originals/01/e7/e2/01e7e206ff9a0b29fb4bac269140dda6.jpg";

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
              <Link to="/">
                <a className="nav-link">
                  <span className={this.getLinkClass(0)}>HOME</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/awards">
                <a className="nav-link">
                  <span className={this.getLinkClass(1)}>AWARDS</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
            <Link to="/nominate">
              <a className="nav-link">
                <span className={this.getLinkClass(2)}>NOMINATE</span>
              </a>
            </Link>
            </li>
            <li className="nav-item">
            <Link to="/mynominations">
              <a className="nav-link">
                <span className={this.getLinkClass(3)}>MY NOMINATIONS</span>
              </a>
            </Link>
            </li>
          </ul>
          <ul className="nav navbar-nav ml-auto">
            <li className="dropdown links nav-item">
              <a
                className="nav-link"
                id="dropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img id="profilePic" src={this.state.profilePic} />
                <span id="profileName">{profileName}</span>
              </a>

              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a
                  className="dropdown-item profileDropdownItem"
                  onClick={logOutUser}
                >
                  Sign Out
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  private getLinkClass(position: number) {
    let classes = "";
    classes += this.props.selection === position ? "activeSpan" : "justASpan";
    return classes;
  }
}
export default NavBar;
