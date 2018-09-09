import * as React from "react";
import logo1 from "../images/logo1.png";
import { getUser, logOutUser } from "../auth";
import { getMyImage } from "../MicrosoftGraphClient";
import { NavLink } from "react-router-dom";

class NavBar extends React.Component<any, any> {
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

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/home">
          <img src={logo1} height="24" alt="" />
        </NavLink>
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
              <NavLink
                activeClassName="activeLink"
                to="/home"
                className="nav-link"
              >
                <span>HOME</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                activeClassName="activeLink"
                to="/awards"
                className="nav-link"
              >
                <span>AWARDS</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                activeClassName="activeLink"
                to="/nominate"
                className="nav-link"
              >
                <span>NOMINATE</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                activeClassName="activeLink"
                to="/mynominations"
                className="nav-link"
              >
                <span>MY NOMINATIONS</span>
              </NavLink>
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
                <img className="profilePic" src={this.state.profilePic} />
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
}
export default NavBar;
